import { useForm } from "react-hook-form"; 
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import { useEffect, useRef, useState } from "react"; 
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input"; 
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"; 
import useUserInfo from "@/hooks/useUserInfo";
import { useToast } from "@/hooks/use-toast"
import { Fade } from "@/components/animations/Fade";
import { Cross1Icon } from "@radix-ui/react-icons";
import { AnimatedButton } from "@/components/animations/AnimatedButton";
import ShakeOnHover from "@/components/animations/ShakeOnHover";
import ShakeOnHover2 from "@/components/animations/ShakeOnHover2";

const CreateRingFormSchema = z.object({
  imagem: 
  z.unknown().transform(value => value as FileList)
    .optional()
    .refine(value => {
      if (!value) return true;
      if (value.length === 0) return true;
      const file = value[0];
      return file.type.startsWith("image/");
    }, {
      message: "Imagem inválida",
    }),
  nome: z.string().min(1, "O anel precisa de um nome."),
  poder: z.string().min(1, "Você precisa escrever o poder do anel."),
  descricao: z.string().min(1, "Você precisa escrever uma descrição."),
  forjadoPorId: z.number().optional(),
  portadorId: z.number().optional(),
});

type FormData = z.infer<typeof CreateRingFormSchema>;

const CreateRingForm = ({params,goBack}: {params:Anel,goBack:Function}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [ringId, setRingId] = useState<number | null>(null); 
  const [forjando, setForjando] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast()
  const { user }: any = useUserInfo();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(CreateRingFormSchema),
  });

  useEffect(() => {
    if (params!=undefined && params.id) {
      setRingId(params.id)
      setValue("nome", params.nome);
      setValue("poder", params.poder);
      setValue("descricao", params.descricao);
      setValue("forjadoPorId",params.forjadoPor && params.forjadoPor.id );
      setValue("portadorId", params.portador && params.portador.id);

      if (params.imagem) {
        setImagePreview(params.imagem); 
        setImageFile(null);
      }
    }
  }, [params, setValue]);




  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
      setValue('imagem', e.target.files); 
    } else {
      setImagePreview(null);
      setImageFile(null);
      //@ts-ignore
      setValue('imagem', null); 
    }
  };
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };
  
  const uploadImage = async (portadorId:number,file: File) => {
    const formData = new FormData();
    formData.append('file', file);;

    try {
      const token = localStorage.getItem('TOKEN');
      const response = await fetch('http://localhost:3000/api/aneis/upload-image/'+portadorId, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      result.data.success=result.success
      return result.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  const editRingImage = async (id: number| null, file: File) => {
    if(id==null) return
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const token = localStorage.getItem('TOKEN');
      const response = await fetch('http://localhost:3000/api/aneis/edit-image/'+id, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
  
      const result = await response.json();
      result.data.ringId==""
      result.data.success=result.success
      console.log('herereeerererer')
      console.log(result)
      console.log(result.data)
      return result.data;
    } catch (error) {
      console.error('Error uploading and editing image:', error);
      throw error;
    }
  };

  const cleanUpForm = ()=>{
    reset();
    setImagePreview(null);
    setImageFile(null);
    setForjando(false);
  }

  const onSubmit = async (data: FormData) => {
    setForjando(true);
    
    const isBeingEdited:boolean = Object.keys(params).length>0 && ringId!=null
  
    let imgData: any = '';

    let created:boolean = isBeingEdited;
    
    if (imageFile) {
      try {
        if(isBeingEdited){
          imgData = await editRingImage(ringId,imageFile);
          created=true
        }else{
          imgData = await uploadImage(user && user.id ,imageFile);
          created=false
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setForjando(false);
        return;
      }
    }

    console.log(imgData)

 if(imgData!='' && !imgData.success ){
  toast({
    title: "Atenção",
    description: imgData.message,
    variant:'destructive'
  })
  setForjando(false);
  return
}

    data.forjadoPorId = parseInt(user.id)
    data.portadorId = parseInt(user.id)

    try {
      const operation = ringId == null && imgData.ringId == "" ? null : imgData.ringId !== "" ? imgData.ringId : ringId;
      const token = localStorage.getItem('TOKEN');
      const response = await fetch(`http://localhost:3000/api/aneis`, {
        method: operation || Object.keys(params).length>0 ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          id:operation,
          imagem: imageFile ? imgData.ringId + "_" + imgData.imageName :  "", 
          created:created
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);

      if(!result.success){

        toast({
          title: "Atenção",
          description: result.data.message,
          variant:'destructive'
        })
      setImagePreview(null);
      setForjando(false);
        return
      }else{
       
          toast({
            title: "Atenção",
            description: result.status,
          })
      }
      

     

    } catch (error) {
      setImagePreview(null)
      setForjando(false);
      console.error('Error:', error);
    }finally{
      cleanUpForm()
      goBack()

    }
  };

  if (forjando) {
    return (
      <div className="w-full flex justify-center flex-nowrap flex-col">
        <div className="w-full flex justify-center">
          <img height={300} width={400} src="https://i.pinimg.com/originals/3c/22/66/3c2266565ba185146ced8efee25994a3.gif" alt="forge hammer" />
        </div>
        <Progress value={75} className="w-full" />
        <p className="mt-2 text-xl text-white">Forjando o anel...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit,(error:any)=>console.log(error))} className="space-y-4 w-2/4 ">
   <Fade>
     {!imagePreview && (<div className="">
      <label  className="block text-sm font-medium">Imagem do Anel</label>

      <label 
      //@ts-ignore
          onDragOver={handleDragOver}
      //@ts-ignore

          onDrop={handleFileDrop}
      htmlFor="imagem" className="cursor-pointer" >
        <div className=" bg-slate-900 hover:bg-slate-800 z-50 border-2 border-gray-300 border-dashed p-4 rounded-xl flex flex-col items-center justify-center pt-5 pb-6">
            <svg className=" animate-bounce w-8 h-8 mb-4 text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-white "><span className="font-semibold">Clique aqui</span> ou arraste e solte a imagem</p>
            <p className="text-xs text-white">PNG, WEBP, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <Input
          id="imagem"
          type="file"
          accept="image/*"
          className="hidden"
          {...register("imagem")}
          ref={fileInputRef}

          onChange={handleImageChange}
        />
        </label>
        {errors.imagem && <p className="text-red-600 text-sm">{errors.imagem.message}</p>}
      </div>)}
      

      {imagePreview!=null && (
        <div className="m-1 flex justify-center flex-nowrap flex-col text-center transition-all ease-in">
          <span>Preview da imagem</span>
          <div  className=" flex justify-center">
            <img src={imagePreview} alt="Image Preview" className="w-32 h-32 object-cover border rounded-lg" />
          </div>
          <AnimatedButton>

          <Button className="hover:bg-red-700 mt-2 text-white" onClick={()=>{
            setImagePreview(null);
            setImageFile(null);
            //@ts-ignore
            setValue('imagem', null);
          }}> <Cross1Icon className="mr-2"/> Remover Imagem</Button>
          </AnimatedButton>
        </div>
      )}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium">Nome</label>
        <Input className={`${errors.nome?'border-red-600':''}`} id="nome" type="text" {...register("nome")} placeholder="Digite o nome" />
        {errors.nome && <p className="text-red-600 text-sm">{errors.nome.message}</p>}
      </div>

      <div>
        <label htmlFor="poder" className="block text-sm font-medium">Poder</label>
        <Input className={`${errors.nome?'border-red-600':''}`} id="poder" type="text" {...register("poder")} placeholder="Digite o poder" />
        {errors.poder && <p className="text-red-600 text-sm">{errors.poder.message}</p>}
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium">Descrição</label>
        <Textarea className={`${errors.nome?'border-red-600':''}`} id="descricao"  placeholder="Digite a descrição" {...register("descricao")} rows={4} />
        {errors.descricao && <p className="text-red-600 text-sm">{errors.descricao.message}</p>}
      </div>
     <ShakeOnHover2>
      <Button
       className="mt-4 hover:bg-green-600" type="submit">{Object.keys(params).length > 0 ? 'Editar Anel':'Forjar Anel'}</Button>
       </ShakeOnHover2>
      </Fade>
    </form>
  );
};

export default CreateRingForm;

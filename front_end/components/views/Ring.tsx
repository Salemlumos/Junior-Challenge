"use client";

import BadgeFactory from "@/Factory/Badge";
// Add the Dialog import
import { Fade } from "../animations/Fade";
import FadeInList from "../animations/FadeInList";
import { SpinningFadeIn } from "../animations/SpinningFadeIn";
import AnimatedArrowIcon from "../ui/AnimatedArrow";
import Dialog from "@/Factory/Dialog";
import { BounceWrapper } from "@/components/animations/Bounce";
import SlideFromLeft from "@/components/animations/SlideFromLeft";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import CreateRingForm from "@/forms/CreateRingForm";
import { Pencil1Icon, TrashIcon, PlusIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const Rings = ({ setRoute, setParams }: any) => {
  const [api, setApi] = useState<CarouselApi>();
  const [aneis, setAneis] = useState<any>([]);
  const [anelInfo, setAnelInfo] = useState<number>(0);
  const [raceCounts, setRaceCounts] = useState({
    homens: 0,
    elfos: 0,
    anao: 0,
    sauron: 0,
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false); 
  const [selectedAnelId, setSelectedAnelId] = useState<number | null>(null); 
  const [message, setMessage] = useState<string>(""); 
  const [dialogFunction, setDialogFunction] = useState<string>('');
  const user: Usuario = JSON.parse(localStorage.getItem("USER_INFO") ?? "");

  const fetchAneis = async () => {
    try {
      const token = localStorage.getItem("TOKEN");
      const headers = new Headers();
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }

      const response = await fetch("http://localhost:3000/api/aneis", {
        headers,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setAneis(data.data);

      
      const raceCounts: any = {
        homens: 0,
        elfos: 0,
        anao: 0,
        sauron: 0,
      };

      data.data.forEach((anel: any) => {
        if (anel.portador && anel.portador.race) {
          raceCounts[anel.portador.race] += 1;
        }
      });

      setRaceCounts(raceCounts);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchAneis();
  }, []);

  const handleRefetch = () => {
    fetchAneis();
  };


  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setAnelInfo(api.selectedScrollSnap());
    });
  }, [api]);

  const goToCreateView = () => {
    setRoute("create");
  };

  const goToEditView = (anel: object) => {
    setParams(anel);

    console.log(anel);
    setRoute("create");
  };

   const handleDelete = async (id: number|null) => {
    try {
      const token = localStorage.getItem("TOKEN");
      const headers = new Headers();
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }

      const response = await fetch(`http://localhost:3000/api/aneis/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to delete the ring");
      }

      const result = await response.json();
      setMessage(result.status);
      setOpenDialog(false);
      setAnelInfo(aneis.filter((anel: any) => anel.id !== id).length - 1);

      const raceCounts: any = {
        homens: 0,
        elfos: 0,
        anao: 0,
        sauron: 0,
      };

      aneis
        .filter((anel: any) => anel.id !== id)
        .forEach((anel: any) => {
          if (anel.portador && anel.portador.race) {
            raceCounts[anel.portador.race] += 1;
          }
        });
      setAneis(aneis.filter((anel: any) => anel.id !== id));
      setRaceCounts(raceCounts);
    } catch (error: any) {
      setMessage(error.message);
      setOpenDialog(true);
    }
  };

  const handleRoubar = async (id: number|null) => {
    try {
      const token = localStorage.getItem("TOKEN");
      const headers = new Headers();

      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
        headers.append("Content-Type", "application/json");
      }

      const response = await fetch(
        `http://localhost:3000/api/aneis/roubarAnel/${id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ portadorId: user.id }),
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao transferir anel");
      }

      const result = await response.json();
      handleRefetch()
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const confirmDelete = (id: number) => {
    setMessage("Tem certeza que deseja deletar este anel?");
    setSelectedAnelId(id)
    setOpenDialog(true);
    setDialogFunction('del')
  };
  const confirmRoubar = (id: number) => {
    setSelectedAnelId(id)
    setDialogFunction('roubar');
    setMessage("Tem certeza que deseja roubar este anel?");
    setOpenDialog(true);
  };

  const badgeData = [
    {
      label: "Forjar Novo Anel",
      onClick: goToCreateView,
      isClickable: true,
      isAnimated: true,
      className: "bg-purple-900",
    },
    {
      label: `N° Total de Anéis: ${aneis.length}`,
      isClickable: false,
      className: "bg-blue-400",
    },
    {
      label: `Anéis dos Homens: ${raceCounts.homens}`,
      isClickable: false,
      className: "bg-amber-900",
    },
    {
      label: `Anéis dos Elfos: ${raceCounts.elfos}`,
      isClickable: false,
      className: "bg-yellow-600",
    },
    {
      label: `Anéis dos Anões: ${raceCounts.anao}`,
      isClickable: false,
      className: "bg-green-800",
    },
    {
      label: `Anéis de Sauron: ${raceCounts.sauron}`,
      isClickable: false,
      className: "bg-red-500",
    },
  ];
  
  return (
    <div className="sm:m-0 sm:p-0 sm:w-2/5 sm:flex-col sm:flex-wrap md:flex-col md:flex-wrap md:p-4 md:w-11/12">
      <div className="sm:ml-32 w-full">
        <SlideFromLeft>
          <h2 className=" text-lg md:text-2xl font-bold">Os Anéis do Poder</h2>
        </SlideFromLeft>
        <Separator className="my-4" />
      </div>

      <div>
        <FadeInList className=" xl:flex-row xl:flex-nowrap  sm:flex-row sm:flex-nowrap  md:w-auto md:flex-col md:flex-wrap items-center md:flex w-full">
          {badgeData.map((badge:any,idx:number)=>(
             <BadgeFactory.Create key={idx} onClick={badge.isClickable ? badge.onClick : undefined}
             className={badge.className}
             isAnimated={badge.isAnimated}
             title={badge.label} />
          ))}
         
          {/* <BounceWrapper>
            <Badge
              className="md:w-auto w-full sm:mx-0 md:mx-2 p-2 bg-purple-900 text-xs sm:text-sm md:text-base"
              onClick={goToCreateView}
            >
              Forjar Novo Anel
            </Badge>
          </BounceWrapper>
          <Badge className="md:w-auto w-full sm:mx-0 md:mx-2 p-2 bg-blue-400 text-xs sm:text-sm md:text-base">
            N° Total de Anéis: {aneis.length}
          </Badge>
          <Badge className="md:w-auto w-full sm:mx-0 md:mx-2 p-2 bg-amber-900 text-xs sm:text-sm md:text-base">
            Anéis dos Homens: {raceCounts.homens}
          </Badge>
          <Badge className="md:w-auto w-full sm:mx-0 md:mx-2 p-2 bg-yellow-600 text-xs sm:text-sm md:text-base">
            Anéis dos Elfos: {raceCounts.elfos}
          </Badge>
          <Badge className="md:w-auto w-full sm:mx-0 md:mx-2 p-2 bg-green-800 text-xs sm:text-sm md:text-base">
            Anéis dos Anões: {raceCounts.anao}
          </Badge>
          <Badge className="md:w-auto w-full sm:mx-0 md:mx-2 p-2 bg-red-500 text-xs sm:text-sm md:text-base">
            Anéis de Sauron: {raceCounts.sauron}
          </Badge> */}
        </FadeInList>
      </div>

      <Fade className="sm:m-1 w-full flex md:m-4 flex-col flex-wrap">
        <div className="flex justify-center w-full">
          {aneis.length > 0 ? (
            <div className="w-full">
              <div className="flex justify-center">
                {aneis && (
                  <SpinningFadeIn className="w-full sm:w-4/5 md:w-3/5">
                    <Carousel setApi={setApi}>
                      <CarouselContent>
                        {aneis.map((anel: Anel, index: number) => {
                          return (
                            <CarouselItem key={index + "-" + anel.nome}>
                              <span className="text-center">{anel.nome}</span>
                              <Separator className="my-2" />
                              <div className="relative group w-full rounded-xl overflow-hidden flex justify-center">
                                <motion.img
                                  src={anel.imagem}
                                  alt={anel.nome}
                                  className="object-contain h-40 w-40 sm:h-52 sm:w-52 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg"
                                  whileHover={{ scale: 1.1 }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 bg-black bg-opacity-50">
                                  <span className="text-white text-lg font-semibold">
                                {user.id == anel.portador.id && (
                                <>
                                    <Button
                                      className="mr-2"
                                      onClick={() => goToEditView(anel)}
                                    >
                                      <Pencil1Icon className="mr-2" />
                                      Editar
                                    </Button>
                                    <Button
                                      className="mr-2"
                                      variant="destructive"
                                      onClick={() => confirmDelete(anel.id)}
                                    >
                                      <TrashIcon className="mr-2" />
                                      Deletar
                                    </Button>
                                </>
                                  )}
  {user.id != anel.portador.id && (
                                      <Button
                                        className="bg-orange-500"
                                        onClick={() => confirmRoubar(anel.id)}
                                      >
                                        <TrashIcon className="mr-2" />
                                        Roubar
                                      </Button>
  )}
                                  </span>
                                </div>
                              </div>
                            </CarouselItem>
                          );
                        })}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </SpinningFadeIn>
                )}
              </div>

              <div className="flex flex-row flex-wrap justify-center mt-4 gap-2 w-full">
                <Fade className="w-full sm:w-2/4">
                  <div className="flex justify-center">
                    <Card className="w-full sm:h-auto md:h-64  bg-gray-800 text-white">
                      <CardHeader>
                        <CardTitle>
                          {aneis[anelInfo] && aneis[anelInfo].nome}
                        </CardTitle>
                      </CardHeader>
                      <Separator />
                      <CardContent className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
                        <p>
                          <span className="font-bold">Poder: </span>{" "}
                          {aneis[anelInfo] && aneis[anelInfo].poder}
                        </p>
                        <p>
                          <span className="font-bold">Forjado Por: </span>
                          {aneis[anelInfo] && aneis[anelInfo].forjadoPor.nome}
                        </p>
                        <p>
                          <span className="font-bold">Em posse de: </span>
                          {aneis[anelInfo] && aneis[anelInfo].portador.nome}
                        </p>
                        <p className="p-4 bg-gray-950 rounded-md overflow-hidden text-ellipsis whitespace-break-spaces ">
                          "{aneis[anelInfo] && aneis[anelInfo].descricao}"
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </Fade>
                <SlideFromLeft className="w-full sm:w-1/4">
                  <Card className="w-full md:h-64 bg-gray-800 text-white">
                    <CardHeader>
                      <CardTitle>Histórico</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap">
                      {aneis[anelInfo] &&
                        aneis[anelInfo].historico.map(
                          (h: Historico, idx: number) => (
                            <p key={h.action + "_" + idx}>
                              {" "}
                              - {h.action} /{" "}
                              {new Date(h.date).toLocaleDateString("pt-BR") +
                                " | " +
                                new Date(h.date).toLocaleTimeString("pt-BR")}
                            </p>
                          )
                        )}
                    </CardContent>
                  </Card>
                </SlideFromLeft>
              </div>
            </div>
          ) : (
            <div className="text-center mt-4">
              <h1 className="w-full text-lg m-2">
                Nenhum Anél de Poder Encontrado
              </h1>
              <div className="flex justify-center">
                <img
                  src="https://media.tenor.com/nTfGANr9MlAAAAAi/lord-of-the-rings-my-precious.gif"
                  alt="there is no rings"
                />
              </div>
            </div>
          )}
        </div>
      </Fade>

      <Dialog
        state={{
          op: openDialog,
          setOp: (state: boolean) => setOpenDialog(state),
          message: message,
          confirmAction: () => dialogFunction=='del'?handleDelete(selectedAnelId):handleRoubar(selectedAnelId),
        }}
      />
    </div>
  );
};

export const Create = ({ setRoute, params, setParams }: any) => {
  const goBack = () => {
    setParams({});
    setRoute("main");
  };
  return (
    <div className=" w-11/12 flex p-4 flex-col">
      <div className="w-full ">
        <SlideFromLeft>
          <h2 className=" font-bold flex items-center">
            <AnimatedArrowIcon onClick={goBack} />{" "}
            {Object.keys(params).length > 0 ? "Editar" : "Forjar"} Anel
          </h2>
        </SlideFromLeft>
        <Separator className="my-4" />
        <div className="w-full flex justify-center">
          {CreateRingForm({ params, goBack })}
        </div>
      </div>
    </div>
  );
};

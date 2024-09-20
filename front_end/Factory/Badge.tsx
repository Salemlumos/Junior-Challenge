import { BounceWrapper } from "@/components/animations/Bounce"
import { Badge } from "@/components/ui/badge"
import { MouseEventHandler, ReactNode } from "react"

interface createProps{
    isAnimated?:boolean
    onClick?:MouseEventHandler<HTMLDivElement> | undefined
    title:string
    key:number
    className:string
}

 const create = ({isAnimated,onClick,title,key,className}:createProps)=>{

    const AnimatedWrapper = ({children,key:number}:{children:ReactNode,key:number})=>(
        <BounceWrapper>
            {children}
        </BounceWrapper>

    )


    const FinalBadge:React.FC<{key?:number}> = ({key:number})=>(
        <Badge
        {... key!=undefined?{key:key}:{}}
        className={"md:w-auto w-full sm:mx-0 md:mx-2 p- text-xs sm:text-sm md:text-base "+ className}
        onClick={onClick}
      >
        {title}
      </Badge>
    )
    return isAnimated?<AnimatedWrapper key={key}><FinalBadge/></AnimatedWrapper>:<FinalBadge key={key} />
}

interface badgeFactory {
    Create:React.FC<createProps>
}

const BadgeFactory:badgeFactory ={
    Create:create
}

export  default BadgeFactory;
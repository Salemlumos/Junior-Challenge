'use client'
import { Fade } from "@/components/animations/Fade";
import useInitialLoad from "@/hooks/useInitialLoad";
import useUserInfo from "@/hooks/useUserInfo";
import MusicPlayer, { MusicPlayerHandle } from "@/components/sound/MusicPlayer";
import { useEffect, useRef, useState } from "react";
import { Aside } from "@/components/ui/Aside";
import { Rings } from "@/components/views/Ring";
import Routes from '../../components/router/CurrentView';
import { VignetteTransition } from "@/components/animations/VignetteTransition";

export default () => {
    const doorSoundRef = useRef<MusicPlayerHandle>(null);
    const fSoundRef = useRef<MusicPlayerHandle>(null);
    const forgeSoundRef = useRef<MusicPlayerHandle>(null);

    const isLoaded = useInitialLoad();
    const { user }: any = useUserInfo();

    const [route, setRoute] = useState<string>("main");
    const [params, setParams] = useState<any>({});

    return (
        <>
            <div className=" w-full h-screen overflow-hidden">
                
                    <MusicPlayer ref={doorSoundRef} src="/door.wav" playOnce />
                    <MusicPlayer ref={fSoundRef} src="/f_sound.wav" autoplay />
                    <MusicPlayer ref={forgeSoundRef} src="/forge.mp3" autoplay defaultVolume={0.3} />
       
                <iframe
                    loading="eager"
                    className={`hidden md:block absolute top-0 left-0 w-full h-full ease-in-out ${!isLoaded ? 'blur-0 scale-100 opacity-5' : 'blur-md scale-110 opacity-100'}`}
                    src="https://www.youtube.com/embed/vdb8oZwcWL0?autoplay=1&loop=1&playlist=vdb8oZwcWL0&start=30&mute=1&controls=0&showinfo=0&modestbranding=1&playsinline=1"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    title="YouTube Background Video"
                ></iframe>
                <div className={`absolute top-0 left-0  sm:w-auto md-h-auto md:w-full md:h-full transition-all duration-500 ease-in-out ${!isLoaded ? 'blur-0 scale-100 opacity-5' : 'blur-md scale-110 opacity-100'}`} />
                
                <VignetteTransition>
                    <div className="relative z-10 w-full h-svh flex justify-center sm:items-start  md:items-center">
                        <Fade className="sm:w-full md:w-5/6 md:h-3/4 bg-gray-950 z-10 blur-0">
                            <div className="sm:flex-col sm:flex-nowrap md:flex-row md:flex-wrap flex justify-center bg-slate-900 h-full p-4">
                                <Aside setRoute={setRoute} user={user} musicRef={{ music: fSoundRef, door: doorSoundRef, hammers: forgeSoundRef }} />
                                <Routes setRoute={setRoute} routeName={route} params={params} setParams={setParams} />
                            </div>
                        </Fade>
                    </div>
                </VignetteTransition>
            </div>
        </>
    );
};


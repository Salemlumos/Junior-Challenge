"use client";

import { Fade } from "@/components/animations/Fade";
import SauronEye from "@/components/ui/eye";
import { LoginForm } from "@/forms/LoginForm";
import useInitialLoad from "@/hooks/useInitialLoad";

export default function MainPage() {


  // 360x640 (most popular)
  // 375x667
  // 414x896
  // 768x1280
  // Tablets:
  
  // 768x1024
  // 800x1280
  // 834x1112
  // Laptops/Desktops:
  
  // 1366x768 (most common for laptops)
  // 1920x1080 (Full HD)
  // 1440x900
  // 2560x1440 (QHD)
  // Large Screens:
  
  // 3840x2160 (4K)
  // 2560x1080 (Ultrawide)
  
  const isLoaded = useInitialLoad();
  return (
    <div
      className={`relative w-full bg-[url('https://i.redd.it/1p2hl6d04ol91.jpg')] bg-cover bg-center h-screen transition-all duration-500 ease-in-out ${
        isLoaded ? "blur-0 scale-100" : "blur-md scale-110"
      }`}
    >
      <Fade className="w-full flex justify-center items-center h-full  ">
        <div className=" bg-gray-900 px-6 p-2 pt-28 sm:w-11/12   md:w-1/6  lg:w-1/6 lg:m-0 xl:m-0 2xl:m-2  h-2/4 z-10 ">
          <LoginForm />
        </div>

        <div className="bg-white w-2/6 h-2/4 lg:w-2/6  hidden md:block">
          <SauronEye />
        </div>
      </Fade>
    </div>
  );
}

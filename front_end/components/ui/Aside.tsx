import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogoutBtn } from "@/components/auth/Logout";
import VolumeControl from "@/components/sound/MusicControl";
import { motion } from "framer-motion";
import { Fade } from "@/components/animations/Fade";
import { HamburgerMenuIcon, DropdownMenuIcon } from "@radix-ui/react-icons";

export const Aside = ({ user, musicRef }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="h-full overflow-hidden">
      {/* Button to toggle the menu */}
      <Button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 bg-slate-800 p-3 rounded-full sm:top-5 sm:left-5"
      >
        {isOpen ? (
          <DropdownMenuIcon className="w-6 h-6 text-white" /> // Close Icon
        ) : (
          <HamburgerMenuIcon className="w-6 h-6 text-white" /> // Open Icon
        )}
      </Button>

      {/* Sidebar Menu */}
      <motion.div
        initial={{ x: "-100%" }} 
        animate={{ x: isOpen ? 0 : "-100%",opacity: isOpen ? 1:0  }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 z-40 h-full bg-slate-950 p-4 sm:w-full md:w-3/12"
      >
        {/* Avatar Section */}
        <Fade>
          <div className="bg-slate-800 rounded-xl min-h-32 max-h-40  mb-4 p-4 flex flex-col items-center">
            <Avatar className="h-20 w-20 mb-2">
              <AvatarImage src="ht" />
              <AvatarFallback className="text-black">
                {user && user.nome.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="text-white text-xl">{user && user.nome}</div>
            <div className="text-white text-lg">Sua Raça: {user && user.race}</div>
          </div>
        </Fade>

        {/* Volume Control and Logout */}
        <Fade>
          <div className="bg-slate-800 rounded-xl p-4 flex flex-col space-y-4">
            <VolumeControl players={[musicRef.door, musicRef.music, musicRef.hammers]} />
            <LogoutBtn />
          </div>
        </Fade>
      </motion.div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={toggleMenu}
        />
      )}
    </div>
  );
};

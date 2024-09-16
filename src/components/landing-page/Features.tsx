import { Bell, Calendar, FileText, Users } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { AnimatedSquareBackground } from "./Animation";
import { motion } from "framer-motion";

const animationVariants = {
  enterLeft: { opacity: 0, x: -100, transition: { duration: 5.0 } },
  enterRight: { opacity: 0, x: 100, transition: { duration: 5.0 } },
  enterTop: { opacity: 0, y: -100, transition: { duration: 5.0 } },
  enterBottom: { opacity: 0, y: 100, transition: { duration: 5.0 } },
  visible: { opacity: 1, x: 0, y: 0 },
};

const Features = () => {
  const [isWideScreen, setIsWideScreen] = useState<boolean>(false);
  const [isTallScreen, setIsTallScreen] = useState<boolean>(false);
  const [inView, setInView] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 800);
      setIsTallScreen(window.innerHeight > 800);
    };

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setInView(rect.top <= window.innerHeight && rect.bottom >= 0);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  console.log("isWideScreen: ", isWideScreen);
  console.log("isTallScreen: ", isTallScreen);
  console.log("inView: ", inView);

  return (
    <div ref={sectionRef} className="relative">
      <h2 className="text-5xl font-extrabold mb-10">Key Features</h2>
      <AnimatedSquareBackground />
      <div className="w-full h-max flex gap-3 mb-1">
        <motion.div
          className="w-1/2"
          initial="enterLeft"
          animate={inView ? "visible" : "enterLeft"}
          variants={animationVariants}
        >
          <Image
            src={"/members.png"}
            alt="Image"
            height={300}
            width={300}
            className="rounded-lg shadow-2xl w-full h-full"
          />
        </motion.div>

        <div className="w-1/2 flex flex-col gap-0">
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-center flex w-1/2"
            initial="enterTop"
            animate={inView ? "visible" : "enterTop"}
            variants={animationVariants}
          >
            <div className="flex justify-center mb-4 flex-col">
              <Calendar className="w-8 h-8 mb-2 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Leave Management</h3>
              <p className="text-gray-300">
                Submit, approve, and track leave requests effortlessly.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-1/2 flex items-end ml-auto"
            initial="enterBottom"
            animate={inView ? "visible" : "enterBottom"}
            variants={animationVariants}
          >
            <div className="flex justify-center mb-4 flex-col">
              <Users className="w-8 h-8 mb-2 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">User Roles</h3>
              <p className="text-gray-300">
                Support for Admin, HR, Managers, and Employees.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="w-full h-max flex gap-3">
        <div className="w-1/2 flex flex-col gap-0">
          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-center flex w-1/2"
            initial="enterLeft"
            animate={inView ? "visible" : "enterLeft"}
            variants={animationVariants}
          >
            <div className="flex justify-center mb-4 flex-col">
              <FileText className="w-8 h-8 mb-2 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Reporting</h3>
              <p className="text-gray-300">
                Generate comprehensive reports on leave usage.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-1/2 flex items-end ml-auto"
            initial="enterRight"
            animate={inView ? "visible" : "enterRight"}
            variants={animationVariants}
          >
            <div className="flex justify-center mb-4 flex-col">
              <Bell className="w-8 h-8 mb-2 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Notifications</h3>
              <p className="text-gray-300">
                Stay informed with email and in-app notifications.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="w-1/2"
          initial="enterRight"
          animate={inView ? "visible" : "enterRight"}
          variants={animationVariants}
        >
          <Image
            src={"/leaves.png"}
            alt="Image"
            height={300}
            width={300}
            className="shadow-2xl w-full h-full"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Features;

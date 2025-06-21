import { motion } from "framer-motion";

interface SlideProps {
  title: string;
  content: React.ReactNode;
}

export const Slide: React.FC<SlideProps> = ({ title, content }) => {
  return (
    <motion.div
      className="w-full h-full flex flex-col justify-center items-center p-10 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6 text-center">{title}</h2>
      <div className="text-base lg:text-xl text-white max-w-3xl text-center">{content}</div>
    </motion.div>
  );
};

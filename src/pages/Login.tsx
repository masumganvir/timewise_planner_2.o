import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-[140px] opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-pink-600 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-orange-500/20 mb-6"
          >
            <Zap className="w-10 h-10 text-white fill-white" />
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">TimeWise</h1>
          <p className="text-slate-400 font-medium">Elevate your daily productivity</p>
        </div>

        <div className="flex justify-center flex-col items-center">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl",
                headerTitle: "text-white",
                headerSubtitle: "text-slate-400",
                socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10",
                formButtonPrimary: "bg-gradient-to-r from-orange-500 via-orange-600 to-pink-600 border-none",
                formFieldLabel: "text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                formFieldInput: "bg-slate-900/50 border-white/5 text-white focus:ring-orange-500",
                footerActionLink: "text-orange-500 hover:text-orange-400",
                identityPreviewText: "text-white",
                identityPreviewEditButtonIcon: "text-orange-500"
              }
            }}
          />
          <p className="mt-8 text-slate-500 text-[10px] tracking-widest uppercase">
            Created by MG developers
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

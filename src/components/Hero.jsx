
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Hero = () => {
    const { toast } = useToast();

    const handleButtonClick = (buttonName) => {
        toast({
            title: `Fonctionnalité '${buttonName}' à venir !`,
            description: "🚧 Cette fonctionnalité n'est pas encore implémentée—mais ne vous inquiétez pas ! Vous pouvez la demander dans votre prochain message ! 🚀",
        });
    };

    return (
        <section id="home" className="relative h-[670px] flex items-center justify-center text-center overflow-hidden pt-[120px]">
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/assets/banner-fallback.jpg"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center 70%' }}
                >
                    <source src="https://videos.pexels.com/video-files/3254066/3254066-uhd_2560_1440_25fps.mp4" type="video/mp4" />
                    Votre navigateur ne supporte pas la vidéo.
                </video>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-20 container mx-auto px-4 text-white"
            >
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                    Transformez Votre Vision en{' '}
                    <span className="text-secondary">Réalité Digitale</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
                    Solutions web professionnelles sur mesure. Design moderne, développement robuste et applications innovantes pour propulser votre entreprise.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button onClick={() => handleButtonClick('Démarrer un Projet')} size="lg" className="bg-primary hover:bg-primary/90 text-white border-2 border-transparent hover:border-secondary">
                        Démarrer un Projet
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button onClick={() => handleButtonClick('Nos Réalisations')} size="lg" variant="outline" className="bg-transparent text-white border-secondary hover:bg-secondary hover:text-primary">
                        Nos Réalisations
                    </Button>
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;

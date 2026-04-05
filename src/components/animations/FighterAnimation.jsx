import React from 'react';
import './FighterAnimation.css';

export default function FighterAnimation() {
    return (
        <div className="combat-arena w-full max-w-4xl mx-auto h-[400px] relative overflow-hidden flex items-center justify-center rounded-2xl border border-zinc-800 bg-black/50 shadow-[0_0_50px_rgba(0,0,0,0.8)]">

            {/* Background elements */}
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600 rounded-full blur-[120px] opacity-10 arena-glow"></div>

            {/* Impact Spark */}
            <div className="impact-spark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40px] z-30">
                <div className="spark ring-1"></div>
                <div className="spark ring-2"></div>
                <div className="spark-particle p1"></div>
                <div className="spark-particle p2"></div>
                <div className="spark-particle p3"></div>
                <div className="spark-particle p4"></div>
            </div>

            {/* Left Fighter (Attacker) */}
            <div className="fighter attacker absolute left-[calc(50%-120px)] bottom-[25%] z-20">
                <div className="fighter-shadow"></div>
                <div className="skeleton neon-red">
                    <div className="head"></div>
                    <div className="torso">
                        <div className="arm arm-back">
                            <div className="forearm"></div>
                        </div>
                        <div className="arm arm-front">
                            <div className="forearm"></div>
                        </div>
                        <div className="leg leg-back">
                            <div className="shin"></div>
                        </div>
                        <div className="leg leg-front">
                            <div className="shin"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Fighter (Defender) */}
            <div className="fighter defender absolute right-[calc(50%-120px)] bottom-[25%] z-10">
                <div className="fighter-shadow"></div>
                <div className="skeleton neon-blue">
                    <div className="head"></div>
                    <div className="torso">
                        <div className="arm arm-back">
                            <div className="forearm"></div>
                        </div>
                        <div className="arm arm-front">
                            <div className="forearm"></div>
                        </div>
                        <div className="leg leg-back">
                            <div className="shin"></div>
                        </div>
                        <div className="leg leg-front">
                            <div className="shin"></div>
                        </div>
                    </div>
                </div>
                {/* Shield Effect */}
                <div className="block-shield"></div>
            </div>

            {/* Floor/Mat */}
            <div className="absolute bottom-[23%] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-zinc-600 to-transparent"></div>
        </div>
    );
}

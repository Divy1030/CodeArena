'use client'
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

function CanvasLogin() {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const animationFrameRef = useRef();
    const [imageLoaded, setImageLoaded] = useState(false);
    const eyePositionsRef = useRef({
        left: { outer: { x: 275, y: 230 }, inner: { x: 275, y: 230 } },
        left1: { outer: { x: 210, y: 105 }, inner: { x: 210, y: 105 } },
        right1: { outer: { x: 240, y: 105 }, inner: { x: 240, y: 105 } },
        right: { outer: { x: 295, y: 230 }, inner: { x: 295, y: 230 } },
        blackLeft: { outer: { x: 170, y: 410 } },
        blackRight: { outer: { x: 210, y: 410 } },
        singleBlack: { outer: { x: 310, y: 310 } },
        singleBlack2: { outer: { x: 330, y: 310 } },
        semiCircle: { x: 190, y: 430 },
        curvedRectangle: { x: 225, y: 125 },
        OpenMouth: { x: 320, y: 340 },
    });

    useEffect(() => {
        if (!imageLoaded) return;

        const canvas = canvasRef.current;
        const container = document.querySelector('.canvas-container');
        if (!canvas || !container) return;

        const c = canvas.getContext('2d');
        if (!c) return;

        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        const eyes = {
            left: {
                baseX: 275,
                baseY: 230,
                outerRadius: 7,
                innerRadius: 4
            },
            left1: {
                baseX: 210,
                baseY: 105,
                outerRadius: 7,
                innerRadius: 4
            },
            right1: {
                baseX: 240,
                baseY: 105,
                outerRadius: 7,
                innerRadius: 4
            },
            right: {
                baseX: 295,
                baseY: 230,
                outerRadius: 7,
                innerRadius: 4
            },
            blackLeft: {
                baseX: 170,
                baseY: 410,
                outerRadius: 6
            },
            blackRight: {
                baseX: 210,
                baseY: 410,
                outerRadius: 6
            },
            singleBlack: {
                baseX: 310,
                baseY: 310,
                outerRadius: 4
            },
            singleBlack2: {
                baseX: 330,
                baseY: 310,
                outerRadius: 4
            },
            semiCircle: {
                baseX: 190,
                baseY: 430,
                radius: 15
            },
            curvedRectangle: {
                baseX: 225,
                baseY: 125,
                radius: 20
            },
            OpenMouth: {
                baseX: 310,
                baseY: 340,
                radius: 6
            }
        };

        function calculateCurvedRectanglePosition(mouseX, mouseY, base) { }

        function drawCurvedRectangle(position) {
            c.strokeStyle = '#000000';
            c.lineWidth = 3;

            c.beginPath();

            c.arc(
                position.x, 
                position.y,  
                eyes.curvedRectangle.radius,  
                Math.PI * 0.30,   
                Math.PI * 0.70,   
                false  
            );
            c.stroke();
        }

        function drawOpenMouth(position) {
            c.strokeStyle = '#000000';
            c.lineWidth = 3;

            c.beginPath();

            c.ellipse(
                position.x,
                position.y,
                eyes.OpenMouth.radius,
                eyes.OpenMouth.radius * 1.5,
                Math.PI * 2,
                Math.PI * 2,
                false
            );

            c.stroke();
        }

        function calculateSemiCirclePosition(mouseX, mouseY, base, extra = 0) {
            const dx = mouseX - base.baseX + extra;
            const dy = mouseY - base.baseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxMove = 10; 

            let moveX = (dx / distance) * Math.min(distance * 0.1, maxMove) * 1.5;
            let moveY = (dy / distance) * Math.min(distance * 0.1, maxMove) * 1.5;

            // Prevent NaN when distance is 0
            if (isNaN(moveX) || isNaN(moveY)) {
                return {
                    x: base.baseX,
                    y: base.baseY
                };
            }

            return {
                x: base.baseX + moveX,
                y: base.baseY + moveY
            };
        }

        function drawSemiCircle(position) {
            c.beginPath();
            c.arc(position.x, position.y, eyes.semiCircle.radius, Math.PI, 0, true);
            c.fillStyle = 'black';
            c.fill();
        }

        function lerp(start, end, factor) {
            return start + (end - start) * factor;
        }

        function calculateEyePosition(mouseX, mouseY, eye, extraw = 0, extrah = 0) {
            const outerOvalWidth = 20 + extraw;
            const outerOvalHeight = 20 + extrah / 3;
            const leftOffset = -20;

            let dx = mouseX - eye.baseX;
            let dy = mouseY - eye.baseY;
            let angle = Math.atan2(dy, dx);

            let outerX = (eye.baseX + leftOffset) + Math.cos(angle) * outerOvalWidth;
            let outerY = eye.baseY + Math.sin(angle) * outerOvalHeight;

            if (!eye.innerRadius) {
                return {
                    outer: { x: outerX, y: outerY }
                };
            }

            let innerDx = mouseX - outerX;
            let innerDy = mouseY - outerY;
            let innerAngle = Math.atan2(innerDy, innerDx);
            let innerDistance = 2;

            let innerX = outerX + Math.cos(innerAngle) * innerDistance;
            let innerY = outerY + Math.sin(innerAngle) * innerDistance;

            return {
                outer: { x: outerX, y: outerY },
                inner: { x: innerX, y: innerY }
            };
        }

        function drawEye(positions, radius, isBlackEye = false) {
            if (isBlackEye) {
                c.beginPath();
                c.ellipse(positions.outer.x, positions.outer.y, radius.outerRadius,
                    radius.outerRadius * 1.5, 0, 0, Math.PI * 2);
                c.fillStyle = 'black';
                c.fill();
                return;
            }

            c.beginPath();
            c.ellipse(positions.outer.x, positions.outer.y, radius.outerRadius,
                radius.outerRadius * 1.5, 0, 0, Math.PI * 2);
            c.fillStyle = 'white';
            c.fill();
            c.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            c.stroke();

            c.beginPath();
            c.ellipse(positions.inner.x, positions.inner.y, radius.innerRadius,
                radius.innerRadius * 1.5, 0, 0, Math.PI * 2);
            c.fillStyle = 'black';
            c.fill();

            const shineRadius = radius.innerRadius * 0.4;
            c.beginPath();
            c.arc(positions.inner.x + radius.innerRadius * 0.3,
                positions.inner.y - radius.innerRadius * 0.3,
                shineRadius, 0, Math.PI * 2);
            c.fillStyle = 'rgba(255, 255, 255, 0.8)';
            c.fill();
        }

        function animate() {
            c.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the background image
            if (imageRef.current) {
                c.drawImage(imageRef.current, 0, -90, canvas.width, canvas.height);
            }

            drawSemiCircle(eyePositionsRef.current.semiCircle);
            drawCurvedRectangle(eyePositionsRef.current.curvedRectangle);
            drawOpenMouth(eyePositionsRef.current.OpenMouth);

            drawEye(eyePositionsRef.current.left,
                { outerRadius: eyes.left.outerRadius, innerRadius: eyes.left.innerRadius });
            drawEye(eyePositionsRef.current.left1,
                { outerRadius: eyes.left1.outerRadius, innerRadius: eyes.left1.innerRadius });
            drawEye(eyePositionsRef.current.right1,
                { outerRadius: eyes.right1.outerRadius, innerRadius: eyes.right1.innerRadius });
            drawEye(eyePositionsRef.current.right,
                { outerRadius: eyes.right.outerRadius, innerRadius: eyes.right.innerRadius });

            drawEye(eyePositionsRef.current.blackLeft,
                { outerRadius: eyes.blackLeft.outerRadius }, true);
            drawEye(eyePositionsRef.current.blackRight,
                { outerRadius: eyes.blackRight.outerRadius }, true);
            drawEye(eyePositionsRef.current.singleBlack,
                { outerRadius: eyes.singleBlack.outerRadius }, true);
            drawEye(eyePositionsRef.current.singleBlack2,
                { outerRadius: eyes.singleBlack2.outerRadius }, true);

            animationFrameRef.current = requestAnimationFrame(animate);
        }

        function handleMouseMove(e) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const leftPos = calculateEyePosition(mouseX, mouseY, eyes.left, 0, 0);
            const left1Pos = calculateEyePosition(mouseX, mouseY, eyes.left1, 10, 10);
            const right1Pos = calculateEyePosition(mouseX, mouseY, eyes.right1, 10, 10);
            const rightPos = calculateEyePosition(mouseX, mouseY, eyes.right, 0, 0);
            const blackLeftPos = calculateEyePosition(mouseX, mouseY, eyes.blackLeft, 15, 15);
            const blackRightPos = calculateEyePosition(mouseX, mouseY, eyes.blackRight, 15, 15);
            const singleBlackPos = calculateEyePosition(mouseX, mouseY, eyes.singleBlack, 0, 12);
            const singleBlackPos2 = calculateEyePosition(mouseX, mouseY, eyes.singleBlack2, 0, 12);
            const semiCirclePos = calculateSemiCirclePosition(mouseX, mouseY, eyes.semiCircle, 0);
            const curvedRectanglePos = calculateSemiCirclePosition(mouseX, mouseY, eyes.curvedRectangle, 0);
            const OpenMouthPos = calculateSemiCirclePosition(mouseX, mouseY, eyes.OpenMouth, 5);

            const easing = 0.1;
            eyePositionsRef.current = {
                left: {
                    outer: {
                        x: lerp(eyePositionsRef.current.left.outer.x, leftPos.outer.x, easing),
                        y: lerp(eyePositionsRef.current.left.outer.y, leftPos.outer.y, easing)
                    },
                    inner: {
                        x: lerp(eyePositionsRef.current.left.inner.x, leftPos.inner.x, easing),
                        y: lerp(eyePositionsRef.current.left.inner.y, leftPos.inner.y, easing)
                    }
                },
                left1: {
                    outer: {
                        x: lerp(eyePositionsRef.current.left1.outer.x, left1Pos.outer.x, easing),
                        y: lerp(eyePositionsRef.current.left1.outer.y, left1Pos.outer.y, easing)
                    },
                    inner: {
                        x: lerp(eyePositionsRef.current.left1.inner.x, left1Pos.inner.x, easing),
                        y: lerp(eyePositionsRef.current.left1.inner.y, left1Pos.inner.y, easing)
                    }
                },
                right1: {
                    outer: {
                        x: lerp(eyePositionsRef.current.right1.outer.x, right1Pos.outer.x, easing),
                        y: lerp(eyePositionsRef.current.right1.outer.y, right1Pos.outer.y, easing)
                    },
                    inner: {
                        x: lerp(eyePositionsRef.current.right1.inner.x, right1Pos.inner.x, easing),
                        y: lerp(eyePositionsRef.current.right1.inner.y, right1Pos.inner.y, easing)
                    }
                },
                right: {
                    outer: {
                        x: lerp(eyePositionsRef.current.right.outer.x, rightPos.outer.x, easing),
                        y: lerp(eyePositionsRef.current.right.outer.y, rightPos.outer.y, easing)
                    },
                    inner: {
                        x: lerp(eyePositionsRef.current.right.inner.x, rightPos.inner.x, easing),
                        y: lerp(eyePositionsRef.current.right.inner.y, rightPos.inner.y, easing)
                    }
                },
                blackLeft: {
                    outer: {
                        x: lerp(eyePositionsRef.current.blackLeft.outer.x, blackLeftPos.outer.x, easing),
                        y: lerp(eyePositionsRef.current.blackLeft.outer.y, blackLeftPos.outer.y, easing)
                    }
                },
                blackRight: {
                    outer: {
                        x: lerp(eyePositionsRef.current.blackRight.outer.x, blackRightPos.outer.x, easing),
                        y: lerp(eyePositionsRef.current.blackRight.outer.y, blackRightPos.outer.y, easing)
                    }
                },
                singleBlack: {
                    outer: {
                        x: lerp(eyePositionsRef.current.singleBlack.outer.x, singleBlackPos.outer.x, easing),
                        y: lerp(eyePositionsRef.current.singleBlack.outer.y, singleBlackPos.outer.y, easing)
                    }
                },
                singleBlack2: {
                    outer: {
                        x: lerp(eyePositionsRef.current.singleBlack2.outer.x, singleBlackPos2.outer.x, easing),
                        y: lerp(eyePositionsRef.current.singleBlack2.outer.y, singleBlackPos2.outer.y, easing)
                    }
                },
                semiCircle: {
                    x: lerp(eyePositionsRef.current.semiCircle.x, semiCirclePos.x, easing),
                    y: lerp(eyePositionsRef.current.semiCircle.y, semiCirclePos.y, easing)
                },
                curvedRectangle: {
                    x: lerp(eyePositionsRef.current.curvedRectangle.x, curvedRectanglePos.x, easing),
                    y: lerp(eyePositionsRef.current.curvedRectangle.y, curvedRectanglePos.y, easing)
                },
                OpenMouth: {
                    x: lerp(eyePositionsRef.current.OpenMouth.x, OpenMouthPos.x, easing),
                    y: lerp(eyePositionsRef.current.OpenMouth.y, OpenMouthPos.y, easing)
                }
            };
        }

        // Load the image using the ref from Next.js Image component
        const img = new window.Image();
        img.src = '/images/login-design.png';
        img.onload = () => {
            imageRef.current = img;
            animate();
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [imageLoaded]);

    return (
        <div className="relative w-full h-full">
            <canvas ref={canvasRef} className="max-w-full absolute inset-0 z-10"></canvas>
            
            {/* Hidden Next.js Image to properly load and handle the image */}
            <div className="hidden">
                <Image 
                    src="/images/auth/canvas.webp" 
                    alt="Login design background"
                    width={800}
                    height={800}
                    priority
                    onLoad={() => setImageLoaded(true)}
                />
            </div>
        </div>
    );
}

export default CanvasLogin;
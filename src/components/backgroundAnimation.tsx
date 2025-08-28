"use client";
import { useEffect } from "react";

const BackgroundAnimation = () => {
  useEffect(() => {
    const canvasShape = function (block_id: string, params: any) {
      let radius_ball = typeof params.size === "number" ? params.size : 10;
      let image =
        typeof params.image === "string"
          ? params.image
          : "http://kidschemistry.ru/wp-content/themes/fary-chemical/images/smile/icon_cool.png";
      let speed_ball = typeof params.speed === "number" ? params.speed : 10;
      let total_ball =
        typeof params.number_of_item === "number"
          ? Math.min(params.number_of_item, 250)
          : 150;
      let ballShape =
        typeof params.shape === "string" ? params.shape : "circle";

      const canvas_el = document.createElement("canvas");
      const canvas = document.getElementById(block_id)!.appendChild(canvas_el);
      const ctx = canvas.getContext("2d")!;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const particles: any[] = [];
      const color1 = params.color;
      document
        .getElementById(block_id)!
        .setAttribute("style", "position: absolute; left: 0; right: 0;");

      function GetRandomColor() {
        if (typeof params.color === "string") {
          return color1;
        } else {
          let r = 0,
            g = 0,
            b = 0;
          while (r < 100 && g < 100 && b < 100) {
            r = Math.floor(Math.random() * 256);
            g = Math.floor(Math.random() * 256);
            b = Math.floor(Math.random() * 256);
          }
          return "rgb(" + r + "," + g + "," + b + ")";
        }
      }

      var Particle = function (this: any, x?: number, y?: number) {
        this.x = x || canvas.width * Math.random();
        this.y = y || canvas.height * Math.random();
        this.vx = speed_ball * Math.random() - 2;
        this.vy = speed_ball * Math.random() - 2;
        this.Color = GetRandomColor();
      };

      Particle.prototype.Draw = function (ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.Color;
        if (ballShape === "circle") {
          ctx.beginPath();
          ctx.arc(this.x, this.y, radius_ball, 0, 2 * Math.PI, false);
          ctx.fill();
        } else if (ballShape === "square") {
          ctx.fillRect(this.x, this.y, radius_ball, radius_ball);
        } else if (ballShape === "triangle") {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + radius_ball, this.y + radius_ball);
          ctx.lineTo(this.x + radius_ball, this.y - radius_ball);
          ctx.closePath();
          ctx.fill();
        } else if (ballShape === "hexa") {
          let side = 0;
          const size = radius_ball;
          const x = this.x;
          const y = this.y;
          ctx.beginPath();
          ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
          for (side; side < 7; side++) {
            ctx.lineTo(
              x + size * Math.cos((side * 2 * Math.PI) / 6),
              y + size * Math.sin((side * 2 * Math.PI) / 6)
            );
          }
          ctx.fill();
        } else if (ballShape === "img") {
          const img = new Image();
          img.src = image;
          ctx.drawImage(img, this.x, this.y);
        }
      };

      Particle.prototype.Update = function () {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      };

      function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const my_gradient = ctx.createLinearGradient(0, 0, 1970, 0);
        my_gradient.addColorStop(0, "#0f0c29");
        my_gradient.addColorStop(0.5, "#302b63");
        my_gradient.addColorStop(1, "#24243e");
        ctx.fillStyle = my_gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
          particles[i].Update();
          particles[i].Draw(ctx);
        }
        requestAnimationFrame(loop);
      }

      for (let i = 0; i < total_ball; i++) particles.push(new (Particle as any)());

      function drawCircle(event: MouseEvent) {
        for (let i = 0; i < 2; i++) {
          const cursorX = event.pageX;
          const cursorY = event.pageY;
          particles.unshift(new (Particle as any)(cursorX, cursorY));
          if (particles.length > 500) {
            particles.pop();
          }
        }
      }
      document.getElementById(block_id)!.style.overflow = "hidden";
      document.getElementById(block_id)!.addEventListener("click", drawCircle);
      document.getElementById(block_id)!.addEventListener("mousemove", drawCircle);

      loop();
      window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
    };

    // Run animation
    canvasShape("canvas-shapes", {
      size: 6,
      speed: 5,
      number_of_item: 200,
      shape: "circle",
    });
  }, []);

  return <div id="canvas-shapes" className="fixed top-0 left-0 w-full h-full -z-10"></div>;
};

export default BackgroundAnimation;

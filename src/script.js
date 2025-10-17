document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('sidebar-carousel');
  if (!track) return; 

  const items = Array.from(track.children);
  if (items.length === 0) return;

  items.forEach(item => {
      const clone = item.cloneNode(true); 
      track.appendChild(clone);
  });

  const itemHeight = items[0].offsetHeight + parseInt(getComputedStyle(items[0]).marginBottom);
  const originalItemsCount = items.length;
  let currentIndex = 0;

  /**
  * Función para desplazar el carrusel y simular el bucle infinito.
  */
  function slide() {
    currentIndex++;
      const translateY = -currentIndex * itemHeight;
      track.style.transform = `translateY(${translateY}px)`;
      if (currentIndex >= originalItemsCount) {
          setTimeout(() => {
            track.style.transition = 'none';
            track.style.transform = 'translateY(0)'; 
            currentIndex = 0;

            track.offsetHeight; 
            track.style.transition = 'transform 0.5s ease-in-out';
          }, 500); // 500ms
        }
    }
    // deslizar cada 4 segundos
    setInterval(slide, 4000); 
});

const quoteTrack = document.getElementById('quote-carousel-track');
if (quoteTrack) {
    const quoteSlides = Array.from(quoteTrack.children);
    const totalSlides = quoteSlides.length;
    let currentQuoteIndex = 0;

    quoteSlides.forEach(slide => {
        quoteTrack.appendChild(slide.cloneNode(true));
    });

    /**
     * Desplaza el carrusel de citas horizontalmente.
     */
    function slideQuotes() {
      currentQuoteIndex++;
      const translateX = -currentQuoteIndex * 100; 
      quoteTrack.style.transform = `translateX(${translateX}%)`;

      // Lógica de reseteo para simular el bucle infinito
      if (currentQuoteIndex >= totalSlides) {
          setTimeout(() => {
              quoteTrack.style.transition = 'none';
              quoteTrack.style.transform = 'translateX(0)';
              currentQuoteIndex = 0;
              quoteTrack.offsetWidth; 
              quoteTrack.style.transition = 'transform 0.8s ease-in-out';
          }, 800); // 800ms 
      }
    }
  //cambia cada 5 segundos
  setInterval(slideQuotes, 5000); 
}

/***Lógica para el Menú Hamburger***/
const menuToggle = document.getElementById('menu-toggle');
const mainNavbar = document.getElementById('main-navbar');
  if (menuToggle && mainNavbar) {
      menuToggle.addEventListener('click', () => {
          mainNavbar.classList.toggle('open');
          const isMenuOpen = mainNavbar.classList.contains('open');
          menuToggle.setAttribute('aria-expanded', isMenuOpen);
          document.body.style.overflow = isMenuOpen ? 'hidden' : '';
      });
        
      // Cierra el menú si se hace clic en un enlace (para mejor UX)
      mainNavbar.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
              mainNavbar.classList.remove('open');
              document.body.style.overflow = '';
              menuToggle.setAttribute('aria-expanded', 'false');
          });
      });
  }

/** Logica de Estrellas Fondo */
function generateStarShadows(count, blur = 0) {
    const shadows = [];
    for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * window.innerWidth * 2); // más allá del viewport
        const y = Math.floor(Math.random() * window.innerHeight * 2);
        shadows.push(`${x}px ${y}px #FFF`);
    }
    return shadows.join(', ');
}

function applyStarfieldCSS(smallCount = 30, mediumCount = 20, largeCount = 10) {
    const style = document.createElement('style');
    style.innerHTML = `
        .starfield {
            width: 3px;
            height: 3px;
            background: transparent;
            position: fixed;
            top: 0;
            left: 0;
            z-index: -1;
            box-shadow: ${generateStarShadows(smallCount)};
            animation: blink 1.5s infinite alternate;
        }
        .starfield::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 3px;
            background: transparent;
            box-shadow: ${generateStarShadows(mediumCount)};
            animation: blink 2.5s infinite alternate;
            filter: blur(0.5px);
        }
        .starfield::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 3px;
            background: transparent;
            box-shadow: ${generateStarShadows(largeCount)};
            animation: blink 3s 1s infinite alternate;
            filter: blur(1px);
        }
          @keyframes blink {
              0% {
                  opacity: 0.8;
              }
              50% {
                  opacity: 0.3;
              }
              100% {
                  opacity: 0.8;
              }
          }
          .manifiesto-section {
              position: relative; 
          }
    `;
    document.head.appendChild(style);
}

applyStarfieldCSS(70, 50, 35); //ajustar los números aquí
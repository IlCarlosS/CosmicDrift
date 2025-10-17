document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const modalCaption = document.getElementById("modalCaption");
    const closeButton = document.querySelector(".close-button");
    const galleryItems = document.querySelectorAll(".bento-item");

    if (galleryItems.length === 0) return;
    let currentImageIndex = -1;

    /**
     * Carga y muestra una imagen específica en el modal.
     * @param {number} index El índice (0-basado) del ítem en el array galleryItems.
     */
    function showImage(index) {
        if (index < 0) {
            index = galleryItems.length - 1; 
        } else if (index >= galleryItems.length) {
            index = 0;
        }

        const item = galleryItems[index];
        const highResUrl = item.getAttribute('href');
        const captionText = item.querySelector('.item-overlay').textContent.trim();
        modalImage.src = highResUrl;
        modalCaption.textContent = captionText;
        currentImageIndex = index; // Actualiza el índice global
    }

    /**
     * Función que abre el modal.
     * @param {number} index El índice (0-basado) de la imagen a mostrar.
     */
    function openModal(index) {
        showImage(index);
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
    }
    
    function navigate(direction) {
        if (modal.classList.contains('visible')) {
            showImage(currentImageIndex + direction);
        }
    }

    // --- Listeners de Clic (Abrir/Cerrar) ---
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            openModal(index); 
        });
    });

    //  clic para el botón de cierre (X)
    closeButton.addEventListener('click', closeModal);

    // clic fuera del modal
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // --- Listener de Teclado  ---
    document.addEventListener('keydown', function(event) {
        if (!modal.classList.contains('visible')) {
            return; // No hacer nada si el modal está cerrado
        }
        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault(); // Evita que la flecha mueva la página
            navigate(1); // Mover a la siguiente imagen
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            navigate(-1); // Mover a la imagen anterior
        }
    });
});
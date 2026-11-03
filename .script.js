
// ==========================================
// ESTATE - MAIN JAVASCRIPT
// ==========================================


// 1. MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navLinks");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
        });
    });
}


// 2. PROPERTY SEARCH AND FILTERING

const searchForm = document.getElementById("searchForm");
const propertyCards = document.querySelectorAll(".property-card");
const propertyCount = document.getElementById("propertyCount");
const noResults = document.getElementById("noResults");

const locationFilter = document.getElementById("locationFilter");
const typeFilter = document.getElementById("typeFilter");
const priceFilter = document.getElementById("priceFilter");
const settingFilter = document.getElementById("settingFilter");


function updatePropertyCount(count) {
    if (!propertyCount) return;

    propertyCount.textContent =
        `${count} ${count === 1 ? "Property" : "Properties"}`;
}


function filterProperties() {

    const selectedLocation = locationFilter
        ? locationFilter.value.toLowerCase().trim()
        : "";

    const selectedType = typeFilter
        ? typeFilter.value.toLowerCase()
        : "";

    const selectedPrice = priceFilter
        ? Number(priceFilter.value)
        : 0;

    const selectedSetting = settingFilter
        ? settingFilter.value.toLowerCase()
        : "";

    let visibleCount = 0;

    propertyCards.forEach(card => {

        const cardLocation =
            (card.dataset.location || "").toLowerCase();

        const cardRegion =
            (card.dataset.region || "").toLowerCase();

        const cardType =
            (card.dataset.type || "").toLowerCase();

        const cardPrice =
            Number(card.dataset.price || 0);

        const detailsButton = card.querySelector(".view-details");

        const cardFeatures = detailsButton
            ? (detailsButton.dataset.features || "").toLowerCase()
            : "";

        const matchesLocation =
            !selectedLocation ||
            cardLocation.includes(selectedLocation) ||
            cardRegion.includes(selectedLocation);

        const matchesType =
            !selectedType ||
            cardType === selectedType;

        const matchesPrice =
            !selectedPrice ||
            cardPrice <= selectedPrice;

        const matchesSetting =
            !selectedSetting ||
            cardFeatures.includes(selectedSetting);

        const matches =
            matchesLocation &&
            matchesType &&
            matchesPrice &&
            matchesSetting;

        card.style.display = matches ? "" : "none";

        if (matches) {
            visibleCount++;
        }
    });

    updatePropertyCount(visibleCount);

    if (noResults) {
        noResults.hidden = visibleCount > 0;
    }
}


// Search button

if (searchForm) {
    searchForm.addEventListener("submit", event => {
        event.preventDefault();

        filterProperties();

        const propertiesSection =
            document.getElementById("properties");

        if (propertiesSection) {
            propertiesSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}


// Update results when a filter changes

[
    locationFilter,
    typeFilter,
    priceFilter,
    settingFilter
].forEach(filter => {

    if (filter) {
        filter.addEventListener("change", filterProperties);
    }
});


// 3. PROPERTY DETAILS MODAL

const propertyModal =
    document.getElementById("propertyModal");

const modalClose =
    document.getElementById("modalClose");

const modalTitle =
    document.getElementById("modalTitle");

const modalLocation =
    document.getElementById("modalLocation");

const modalPrice =
    document.getElementById("modalPrice");

const modalDescription =
    document.getElementById("modalDescription");

const modalWhy =
    document.getElementById("modalWhy");

const modalMainImage =
    document.getElementById("modalMainImage");

const modalThumbnails =
    document.getElementById("modalThumbnails");

const modalBeds =
    document.getElementById("modalBeds");

const modalBaths =
    document.getElementById("modalBaths");

const modalArea =
    document.getElementById("modalArea");

const modalType =
    document.getElementById("modalType");

const modalFeatures =
    document.getElementById("modalFeatures");

const galleryPrev =
    document.getElementById("galleryPrev");

const galleryNext =
    document.getElementById("galleryNext");

const galleryCounter =
    document.getElementById("galleryCounter");


let currentImages = [];
let currentImageIndex = 0;


// Display the selected image

function showModalImage() {

    if (!modalMainImage || currentImages.length === 0) {
        return;
    }

    modalMainImage.src = currentImages[currentImageIndex];

    modalMainImage.alt =
        `Property image ${currentImageIndex + 1}`;

    if (galleryCounter) {
        galleryCounter.textContent =
            `${currentImageIndex + 1} / ${currentImages.length}`;
    }

    if (modalThumbnails) {

        modalThumbnails.innerHTML = "";

        currentImages.forEach((image, index) => {

            const thumbnail = document.createElement("img");

            thumbnail.src = image;
            thumbnail.alt = `Property thumbnail ${index + 1}`;

            if (index === currentImageIndex) {
                thumbnail.classList.add("active");
            }

            thumbnail.addEventListener("click", () => {
                currentImageIndex = index;
                showModalImage();
            });

            modalThumbnails.appendChild(thumbnail);
        });
    }
}


// Open the selected property's details

function openPropertyModal(button) {

    if (!propertyModal) return;

    // Property information comes from the clicked button
    const data = button.dataset;

    if (modalTitle) {
        modalTitle.textContent = data.title || "Property";
    }

    if (modalLocation) {
        modalLocation.textContent = data.location || "";
    }

    if (modalPrice) {
        modalPrice.textContent = data.price || "";
    }

    if (modalDescription) {
        modalDescription.textContent =
            data.description || "Contact us for more information.";
    }

    if (modalWhy) {
        modalWhy.textContent =
            data.why || "Contact our team to learn more about this property.";
    }

    if (modalBeds) {
        modalBeds.textContent = data.beds || "N/A";
    }

    if (modalBaths) {
        modalBaths.textContent = data.baths || "N/A";
    }

    if (modalArea) {
        modalArea.textContent = data.area || "N/A";
    }

    if (modalType) {
        modalType.textContent = data.type || "Property";
    }


    // Load images for this property

    currentImages = data.images
        ? data.images.split("|").map(image => image.trim()).filter(Boolean)
        : [];

    currentImageIndex = 0;

    showModalImage();


    // Display property features

    if (modalFeatures) {

        modalFeatures.innerHTML = "";

        const features = data.features
            ? data.features.split("|")
            : [];

        features.forEach(feature => {

            const listItem = document.createElement("li");

            listItem.textContent = feature.trim();

            modalFeatures.appendChild(listItem);
        });
    }


    // Pass the property name to the contact page

    const enquiryButton =
        document.querySelector(".modal-contact-button");

    if (enquiryButton) {
        enquiryButton.href =
            "contact.html?property=" +
            encodeURIComponent(data.title || "Property");
    }


    // Show modal

    propertyModal.classList.add("active");

    propertyModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}


// Connect every View Details button

document.querySelectorAll(".view-details").forEach(button => {

    button.addEventListener("click", () => {
        openPropertyModal(button);
    });

});


// Next image

if (galleryNext) {

    galleryNext.addEventListener("click", () => {

        if (currentImages.length === 0) return;

        currentImageIndex =
            (currentImageIndex + 1) % currentImages.length;

        showModalImage();
    });
}


// Previous image

if (galleryPrev) {

    galleryPrev.addEventListener("click", () => {

        if (currentImages.length === 0) return;

        currentImageIndex =
            (currentImageIndex - 1 + currentImages.length) %
            currentImages.length;

        showModalImage();
    });
}


// Close modal

function closePropertyModal() {

    if (!propertyModal) return;

    propertyModal.classList.remove("active");

    propertyModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}


if (modalClose) {
    modalClose.addEventListener("click", closePropertyModal);
}


// Close by clicking outside

if (propertyModal) {

    propertyModal.addEventListener("click", event => {

        if (event.target === propertyModal) {
            closePropertyModal();
        }
    });
}


// Keyboard controls

document.addEventListener("keydown", event => {

    if (
        !propertyModal ||
        !propertyModal.classList.contains("active")
    ) {
        return;
    }

    if (event.key === "Escape") {
        closePropertyModal();
    }

    if (event.key === "ArrowRight" && currentImages.length > 0) {

        currentImageIndex =
            (currentImageIndex + 1) % currentImages.length;

        showModalImage();
    }

    if (event.key === "ArrowLeft" && currentImages.length > 0) {

        currentImageIndex =
            (currentImageIndex - 1 + currentImages.length) %
            currentImages.length;

        showModalImage();
    }
});


// 4. CONTACT FORM

const contactForm =
    document.getElementById("contactForm");

const successNotification =
    document.getElementById("successNotification");


if (contactForm) {

    contactForm.addEventListener("submit", event => {

        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        if (successNotification) {

            successNotification.classList.add("show");

            successNotification.setAttribute(
                "aria-hidden",
                "false"
            );

            window.setTimeout(() => {

                successNotification.classList.remove("show");

                successNotification.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }, 4500);
        }

        contactForm.reset();
    });
}


// 5. INITIAL PROPERTY COUNT

filterProperties();

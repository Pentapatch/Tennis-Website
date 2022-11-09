// Configure
const minScrollTop = 400;

// Assign the button to a const
const scrollButton = document.getElementById("scroll-to-top-button");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    // Check if we are at the bottom of the page
    if (document.body.offsetHeight - (window.innerHeight + window.scrollY) <= 1) {
        scrollButton.style.bottom = "4px";
    } else {
        scrollButton.style.bottom = "20px";
    }

    // Check if the user has scrolled down below the set threshold
    if (window.innerWidth >= 550 && (document.body.scrollTop >= minScrollTop || document.documentElement.scrollTop >= minScrollTop)) {
        scrollButton.style.display = "block";
    } else {
        scrollButton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
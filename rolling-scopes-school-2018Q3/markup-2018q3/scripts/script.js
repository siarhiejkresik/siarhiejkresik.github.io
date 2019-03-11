const addClassToElement = klass => element => element.classList.add(klass);
const setElementToVisible = el => (el.style.visibility = 'visible');

const isScrolledIntoView = el => {
    const { top, bottom } = el.getBoundingClientRect();
    return top >= 0 && bottom <= window.innerHeight;
};

const processElementsInSequence = ({ elements, callbacks, delay = 0 }) => {
    Array.prototype.forEach.call(elements, (el, i) => {
        setTimeout(() => {
            callbacks.forEach(callback => callback(el));
        }, i * delay);
    });
};

const hidePackagesPlaceholder = () => {
    document.getElementById('packages-placeholder').style.opacity = 0;
};

const packages = document.getElementsByClassName('package');
const firstPackage = packages[0];
if (firstPackage) {
    const animatePackages = () => {
        if (isScrolledIntoView(firstPackage)) {
            const animationCallback = addClassToElement('slide-in-right');
            hidePackagesPlaceholder();
            processElementsInSequence({
                elements: packages,
                callbacks: [animationCallback, setElementToVisible],
                delay: 500
            });
            window.removeEventListener('scroll', animatePackages);
        }
    };
    window.addEventListener('scroll', animatePackages);
}

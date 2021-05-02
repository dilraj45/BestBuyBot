import {TrackedProductsRepository} from "../persistence/tracked-products-repository";

function generateListElement(sku: string) {
    let element = document.createElement('li');
    let button = document.createElement('button');
    button.appendChild(document.createTextNode('x'));

    element.appendChild(document.createTextNode(sku + ' '));
    element.appendChild(button);
    button.onclick = () => {
        TrackedProductsRepository.removeProduct('CA', sku);
        element.remove();
    };
    return element;
}

const list = document.getElementById('tracked-skus');
TrackedProductsRepository.loadAllProducts('CA', skus => {
    for (let sku of skus) {
        list.appendChild(generateListElement(sku));
    }
});

// Defining form actions
document.getElementById('register-sku').onsubmit = () => {
    let sku = document.getElementById('sku').textContent;
    list.appendChild(generateListElement(sku));
    TrackedProductsRepository.appendProduct('CA', sku);
    return false;
};

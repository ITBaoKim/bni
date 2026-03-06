// 1: Call API get config merchant
// 2: "Kiểm tra các element theo từng cấu hình
//     - nếu không tìm thấy ở bất cứ cấu hình nào (HTML bị thay đổi), đi đến bước 3
//     - nếu không bị thay đổi, đi đến bước 5"
// 3: Call API thông báo cấu trúc HTML đã bị thay đổi
// 4: Baokim thực hiện lại bước crawl HTML và cấu hình JS
// 5: Call API tạo token
// 6: Hiển thị các nút theo cấu hình
// 7: Hiển thị popup
var currentDomain = window.location.hostname;
currentDomain = currentDomain.replace("www.", "");
let bkTotalPrice = 0;
let dataObserver;
var check = currentDomain.substring(0, 2);
if (check == "m.") {
    currentDomain = currentDomain.substring(2);
}

console.log("currentDomain: ", currentDomain);

var currentURL = window.location.href;
var url = new URL(currentURL);
var fullDomainWithPath = "https://" + url.host + url.pathname;
// console.log("fullDomainWithPath: ", fullDomainWithPath);

// var startPointEmbedCore = "https://devtest.baokim.vn/b2b/embed-core";
// var urlPopup = "https://b2b-payment-page.devtest.baokim.vn:8445/popup";
var startPointEmbedCore = "https://ws.baokim.vn/b2b-embed-core";
var urlPopup = "https://payment-b2b.baokim.vn/popup";
if (currentDomain === "13.250.104.189" || currentDomain === "localhost" || currentDomain === "devtest.baokim.vn") {
    startPointEmbedCore = "https://devtest.baokim.vn/b2b/embed-core";
    urlPopup = "https://b2b-payment-page.devtest.baokim.vn:8445/popup";
    console.log("Running in Testing Environment");
}
console.log("Running in Testing Environment 2");
let configInstallmentLimit = 0;
let minAmountKredivo = 0;
let maxAmountKredivo = 0;
let minAmountHcvn = 0;
let maxAmountHcvn = 0;
let minAmountMuadee = 0;
let maxAmountMuadee = 0;
let minAmountFundiin = 0;
let maxAmountFundiin = 0;

let configMrc, configBtn, stylePopup, userConfig;

var token = null;

const bgHeaderDefault = "#006d9c";
const bgColorPaymentDefault = "#e90707";
const bgColorInstallmentDefault = "#288ad6";
const bgColorBnplDefault = "#f1eb1f";

const txColorPaymentDefault = "#ffffff";
const txColorInstallmentDefault = "#ffffff";
const txColorBnplDefault = "#235d97";

let initialProductData = {
    productNames: [],
    productPrices: [],
    productQuantities: [],
    productImages: [],
    platformProductId: null,
    platformVariantId: null,
};

var productProperty = "";
let productConfigBk = {};

function initBaoKim() {
    console.log("Running in Testing Environment 3 - Đã vào hàm khởi tạo!");
    
    // Đảm bảo hàm getConfigMerchant đã được định nghĩa ở dưới nhé
    if (typeof getConfigMerchant === 'function') {
        getConfigMerchant();
    } else {
        console.error("Lỗi: Không tìm thấy hàm getConfigMerchant");
    }
}

// Kiểm tra trạng thái của trang HTML
if (document.readyState === "loading") {
    // Nếu trang vẫn đang parse HTML -> Chờ sự kiện DOMContentLoaded
    document.addEventListener("DOMContentLoaded", initBaoKim);
} else {
    // Nếu trang đã parse xong (interactive hoặc complete) do tải file JS muộn -> Chạy luôn ngay lập tức
    initBaoKim();
}

// document.addEventListener("DOMContentLoaded", function () {
//     console.log("Running in Testing Environment 3");
//     // window.addEventListener("load", function () {
//     getConfigMerchant();
// });

window.mobileCheck = function () {
    let checkDevice = false;
    (function (a) {
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        )
            checkDevice = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return checkDevice;
};

function getConfigMerchant() {
    console.log('oki');
    var url = genUrlEmbedCore("api/merchant/get-config");
    let formData = new FormData();
    formData.append("website", currentDomain);
    configMrc = callXhrApi(url, formData);
    console.log("configMrc: ", configMrc);
    if (configMrc && configMrc.code === 200) {
        configBtn = configMrc.data.config;
        stylePopup = configMrc.data.style_popup;
        userConfig = configMrc.data.user;
        configInstallmentLimit = configBtn.installment.min_order_amount;
        minAmountKredivo = userConfig.kredivo.min_order_amount;
        maxAmountKredivo = userConfig.kredivo.max_order_amount;
        minAmountHcvn = userConfig.hcvn.min_order_amount;
        maxAmountHcvn = userConfig.hcvn.max_order_amount;
        minAmountMuadee = userConfig.muadee.min_order_amount;
        maxAmountMuadee = userConfig.muadee.max_order_amount;
        minAmountFundiin = userConfig.fundiin.min_order_amount ?? 0;
        maxAmountFundiin = userConfig.fundiin.max_order_amount ?? 0;
        const htmlConfigs = configMrc.data.html_configs;
        if (Array.isArray(htmlConfigs) && htmlConfigs.length > 0) {
            for (let i = 0; i < htmlConfigs.length; i++) {
                const config = htmlConfigs[i];
                if (config.type === 1 || config.type === 2) {
                    productConfigBk = {
                        nameClass: config.tag_name,
                        imageClass: config.tag_image,
                        priceClass: config.tag_price,
                        qtyClass: config.tag_quantity,
                        propertyClass: config.tag_description,
                        afterClass: config.position_after,
                        beforeClass: config.position_before,
                    };

                    const nameElement = document.querySelector(
                        productConfigBk.nameClass
                    );
                    const priceElement = document.querySelector(
                        productConfigBk.priceClass
                    );
                    const qtyElement = document.querySelector(
                        productConfigBk.qtyClass
                    );

                    const propertyElement = productConfigBk.propertyClass
                        ? document.querySelector(productConfigBk.propertyClass)
                        : null;
                    const imageElement = document.querySelector(
                        productConfigBk.imageClass
                    );

                    if (
                        nameElement &&
                        priceElement &&
                        qtyElement
                    ) {
                        monitorDOMChanges();
                        break;
                    }
                }
            }
        } else {
            productConfigBk = {
                nameClass: ".bk-product-name",
                imageClass: ".bk-product-image",
                priceClass: ".bk-product-price",
                qtyClass: ".bk-product-qty",
                propertyClass: ".bk-product-property",
                afterClass: null,
                beforeClass: null,
            };
            const nameElement = document.querySelector(productConfigBk.nameClass);
            // const imageElement = document.querySelector(
            //     productConfigBk.imageClass
            // );
            const priceElement = document.querySelector(
                productConfigBk.priceClass
            );
            // const qtyElement = document.querySelector(productConfigBk.qtyClass);
            // const propertyElement = document.querySelector(
            //     productConfigBk.propertyClass
            // );

            if (nameElement && priceElement) {
                monitorDOMChanges();
            } else {
                console.log("Không tìm thấy đủ các phần tử sản phẩm.");
            }
        }
    }
}

function monitorDOMChanges() {
    let isButtonCreated = false;
    let allElementsPresent = false;
    console.log("productConfigBk: ", productConfigBk);
    function checkElements() {
        const nameElements = document.querySelectorAll(productConfigBk.nameClass);
        const imageElements = document.querySelectorAll(
            productConfigBk.imageClass
        );
        const priceElements = document.querySelectorAll(
            productConfigBk.priceClass
        );
        const qtyElements = document.querySelectorAll(productConfigBk.qtyClass);
        const propertyElements = document.querySelectorAll(
            productConfigBk.propertyClass
        );
        const afterElement = document.querySelector(productConfigBk.afterClass);
        const beforeElement = document.querySelector(productConfigBk.beforeClass);
        bkTotalPrice = 0;
        if (nameElements.length > 0) {

            nameElements.forEach((nameElement, index) => {
                const imageElement = imageElements[index];
                const priceElement = priceElements[index];
                const qtyElement = qtyElements[index];
                const propertyElement = propertyElements[index];
                if (priceElement) {
                    const priceValue = parseFloat(
                        priceElement.innerHTML.trim().replace(/[^\d]/g, "")
                    );
                    if (!isNaN(priceValue)) {
                        bkTotalPrice += priceValue;
                    }
                }
                if (nameElement && priceElement) {
                    allElementsPresent = true;
                }
            });

            if (allElementsPresent) {
                if (!isButtonCreated) {
                    createButtonContainer(afterElement, beforeElement);
                    // getData();
                    updateProductDataOnChange();

                    document
                        .querySelectorAll(".bk-btn-box")
                        .forEach((bkBtnBox) => {
                            showButton(configBtn, bkBtnBox);
                        });

                    attachButtonClickEvents();
                    isButtonCreated = true;
                }
            }

            return true;
        }
        return false;
    }

    if (!checkElements()) {
        const observerConfigMrc = new MutationObserver(
            (mutations, observerInstance) => {
                if (checkElements()) {
                    observerInstance.disconnect();
                } else {
                    console.error("Missing one or more necessary elements.");
                    callApiCrawlData();
                }
            }
        );

        observerConfigMrc.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
}

function getVariantId() {
    return typeof variant_id_pro !== "undefined"
        ? variant_id_pro
        : document.getElementById("product-selectors")?.value ||
              document.getElementById("product-select")?.value ||
              document.querySelector("[name=variantId]")?.value ||
              document.getElementById("productSelect")?.value ||
              document.getElementById("dimension-select")?.value ||
              null;
}

function getData() {
    const imageElement = document.querySelectorAll(productConfigBk.imageClass);
    const nameElement = document.querySelectorAll(productConfigBk.nameClass);
    const priceElement = document.querySelectorAll(productConfigBk.priceClass);
    const qtyElement = document.querySelectorAll(productConfigBk.qtyClass);
    const propertyElement = document.querySelectorAll(
        productConfigBk.propertyClass
    );

    const maxLoop = nameElement.length;
    initialProductData = {
        productNames: [],
        productPrices: [],
        productQuantities: [],
        productImages: [],
        platformProductId: null,
        platformVariantId: null,
    };
    bkTotalPrice = 0;
    for (let i = 0; i < maxLoop; i++) {
        initialProductData.productNames.push(nameElement[i].innerHTML.trim());

        // let price = parseFloat(
        //     priceElement[i].innerHTML.trim().replace(/[^\d]/g, "")
        // );

        let priceText = priceElement[i].textContent.trim();
        let price = parseFloat(priceText.replace(/[^\d]/g, ""));

        initialProductData.productPrices.push(price);
        bkTotalPrice += price;

        let src = imageElement[i].getAttribute("src");
        if (src && src.startsWith("data:image")) {
            const dataSrc = imageElement[i].getAttribute("data-src");
            if (dataSrc) {
                src = dataSrc; // Dùng data-src nếu có
            }
        }

        // Nếu vẫn chưa có src hợp lệ, thử lấy từ data-src như fallback
        if (!src) {
            src = imageElement[i].getAttribute("data-src");
        }

        // Nếu src tồn tại và là đường dẫn tương đối, thêm domain
        if (src && !src.includes("//")) {
            src = window.location.protocol + "//" + currentDomain + "/" + src;
        }
        initialProductData.productImages.push(src);

        if (qtyElement[i] !== undefined) {
            initialProductData.productQuantities.push(qtyElement[i].value || 1);
        } else {
            initialProductData.productQuantities.push(1);
        }

        if (typeof meta !== "undefined") {
            if (typeof meta.product !== "undefined") {
                initialProductData.platformProductId = meta.product.id;
            }
        }
    }
    initialProductData.platformVariantId = getVariantId();

    productProperty = "";
    for (let i = 0; i < propertyElement.length; i++) {
        var tmp = propertyElement[i];
        // initialProductData.platformVariantId = tmp.value;
        if (!initialProductData.platformVariantId) {
            initialProductData.platformVariantId = Math.ceil(tmp.value);
            if (isNaN(initialProductData.platformVariantId)) {
                initialProductData.platformVariantId = null;
            }
        }
        if (tmp.tagName.toLowerCase() === "input") {
            productProperty += tmp.value + " - ";
        } else if (tmp.tagName.toLowerCase() === "select") {
            productProperty += tmp.options[tmp.selectedIndex].text + " - ";
        } else {
            productProperty += tmp.innerHTML + " ";
        }
    }
    productProperty = productProperty.slice(0, -2);

    console.log("bkTotalPrice: ", bkTotalPrice);
    if (bkTotalPrice < configInstallmentLimit) {
        removeInstallmentButton();
    } else {
        document.querySelectorAll(".bk-btn-box").forEach((bkBtnBox) => {
            showButton(configBtn, bkBtnBox);
        });
    }
    updateProductDataOnChange();
}

function updateProductDataOnChange() {
    console.log("initialProductData: ", initialProductData);
    if (
        !initialProductData ||
        !Array.isArray(initialProductData.productPrices) ||
        initialProductData.productPrices.length === 0
    ) {
        console.warn("initialProductData is invalid, calling getData...");
        getData();
    }
    if (!dataObserver) {
        dataObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.target.matches(productConfigBk.priceClass)) {
                    token = null;
                    bkTotalPrice = 0;
                    let newPrice = parseFloat(
                        mutation.target.innerHTML.trim().replace(/[^\d]/g, "")
                    );
                    const index = Array.from(
                        document.querySelectorAll(productConfigBk.priceClass)
                    ).indexOf(mutation.target);
                    console.log("index: ", index);
                    if (index !== -1) {
                        console.log("bkTotalPrice update: ", newPrice);
                        initialProductData.productPrices[index] = newPrice;
                        bkTotalPrice = newPrice;
                        if (bkTotalPrice < configInstallmentLimit) {
                            removeInstallmentButton();
                        } else {
                            document
                                .querySelectorAll(".bk-btn-box")
                                .forEach((bkBtnBox) => {
                                    showButton(configBtn, bkBtnBox);
                                });
                        }
                        // createToken(generateOrderData());
                        attachButtonClickEvents();
                    }
                }
                if (mutation.target.matches(productConfigBk.qtyClass)) {
                    let newQty = parseInt(mutation.target.value.trim()); // Lấy giá trị mới của số lượng
                    const index = Array.from(
                        document.querySelectorAll(productConfigBk.qtyClass)
                    ).indexOf(mutation.target);
                    if (index !== -1) {
                        // console.log("newQty: ", newQty);
                        initialProductData.productQuantities[index] = newQty; // Gán giá trị mới vào productQuantities
                        // createToken(generateOrderData());
                        attachButtonClickEvents();
                    }
                }
            });
        });
        document.querySelectorAll(productConfigBk.priceClass).forEach((element) =>
            dataObserver.observe(element, {
                childList: true,
                subtree: true,
            })
        );
    }
    attachButtonClickEvents();
}

function createButtonContainer(afterElement, beforeElement) {
    let bkBtnElements = document.getElementsByClassName("bk-btn");
    let bkBtn;

    let bkModal = document.getElementById("bk-modal-b2b");
    if (!bkModal) {
        bkModal = createModal();
        document.body.appendChild(bkModal);
    }
    if (bkBtnElements.length > 0) {
        for (let i = 0; i < bkBtnElements.length; i++) {
            bkBtn = bkBtnElements[i];
            let bkBtnContent = bkBtn.querySelector(".bk-btn-box"); // Kiểm tra phần tử con
            console.log("bkBtnContent: ", bkBtnContent);

            if (!bkBtnContent) {
                console.log("Chưa có bk-btn-box, tiến hành chèn vào...");
                const newBkBtnContent = document.createElement("div");
                newBkBtnContent.className = "bk-btn-box";
                bkBtn.appendChild(newBkBtnContent);
            }

            bkBtn.addEventListener("click", () => {
                bkModal.style.display = "block";
            });
        }
    } else {
        if (currentDomain == "hoangtuan.vn") {
            // bkplus v1
            let bkBtnPayment = document.getElementsByClassName("detail-buy");
            if (bkBtnPayment.length > 0) {
                afterElement = document.querySelector(
                    ".content-top-detail .detail-buy"
                );
                beforeElement = null;
                bkBtn = createButton();
                insertButton(bkBtn, afterElement, beforeElement);
            }
        } else if (currentDomain == "babashop.vn") {
            // bkplus v1
            let bkBtnPayment = document.getElementsByClassName("thanhtoannhanh");
            if (bkBtnPayment.length > 0) {
                afterElement = document.querySelector(
                    ".tt-right-desc-detail-r .muahang.thanhtoannhanh"
                );
                beforeElement = null;
                bkBtn = createButton();
                insertButton(bkBtn, afterElement, beforeElement);
            }
        } else {
            // b2b
            console.log("Không tìm thấy bk-btn, tạo mới...");
            bkBtn = createButton();
            insertButton(bkBtn, afterElement, beforeElement);
        }

        if (bkBtn) {
            bkBtn.addEventListener("click", () => {
                bkModal.style.display = "block";
            });
        }
    }

    const closeButton = bkModal.querySelector("#bk-modal-close");
    const modalPaymentB2B = document.getElementById("bk-modal-payment");
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            bkModal.style.display = "none";
            modalPaymentB2B.style.display = "none";
            document.body.style.overflow = "";
        });
    }
}

function createButton() {
    const bkBtn = document.createElement("div");
    bkBtn.className = "bk-btn";

    const bkBtnContent = document.createElement("div");
    bkBtnContent.className = "bk-btn-box";
    bkBtn.appendChild(bkBtnContent);

    return bkBtn;
}

function createModal() {
    const bkModal = document.createElement("div");
    bkModal.id = "bk-modal-b2b";
    bkModal.style.display = "none";

    let innerIdBkModal = "";
    innerIdBkModal += `<div id="bk-modal-payment" class="bk-modal">`;
    innerIdBkModal +=
        ' <div class="bk-modal-content" id="bk-modal-content-style">';
    innerIdBkModal += '     <div id="bk-modal-pop" class="bk-modal-header">';
    innerIdBkModal +=
        '         <div class="bk-container-fluid position-relative" style="box-sizing: border-box; height: 0 !important;">';
    innerIdBkModal += '             <div class="bk-row bk-close-v3">';
    innerIdBkModal +=
        '                 <div class="bk-col-4 bk-col-lg-3 bk-text-right" style="box-sizing: border-box">';
    innerIdBkModal +=
        '                     <button type="button" id="bk-modal-close">&times;</button>';
    innerIdBkModal += "                 </div>";
    innerIdBkModal += "             </div>";
    innerIdBkModal += "          </div>";
    innerIdBkModal += "     </div>";
    innerIdBkModal += `     <div class="bk-modal-body"><iframe width="100%" height="100%" id="iframe" src=""></iframe></div>`;
    innerIdBkModal += " </div>";
    innerIdBkModal += `</div>`;

    bkModal.innerHTML = innerIdBkModal;
    return bkModal;
}

function insertButton(bkBtn, afterElement, beforeElement) {
    const hasBeforeElement = beforeElement?.classList?.length > 0;
    const hasAfterElement = afterElement?.classList?.length > 0;

    if (hasBeforeElement && hasAfterElement) {
        afterElement.parentNode.insertBefore(
            bkBtn,
            beforeElement || afterElement.nextSibling
        );
    } else if (hasBeforeElement) {
        beforeElement.parentNode.insertBefore(bkBtn, beforeElement);
    } else if (hasAfterElement) {
        afterElement.parentNode.insertBefore(bkBtn, afterElement.nextSibling);
    } else {
        console.error("Không có phần tử hợp lệ để chèn nút.");
    }
}

function callApiCrawlData() {
    console.error("Calling API to inform HTML structure has changed.");
}

async function createToken(dataOrderTemporary) {
    const url = genUrlEmbedCore("api/token-management/generate-token");
    console.log("request create token: ", dataOrderTemporary);
    const response = callXhrApi(url, JSON.stringify(dataOrderTemporary));
    console.log("response create token: ", response);
    if (response && response.code === 200) {
        token = response.data.token;
    } else {
        console.error("Token generation failed.");
    }
}

function showButton(configBtn, bkBtnContentElement) {
    console.log("configBtn: ", configBtn);
    const configPayment = configBtn.payment;
    const configInstallment = configBtn.installment;
    const configBnpl = configBtn.installment_amigo;
    function getStyleByType(type) {
        return stylePopup.find(
            (style) => style.type === type && style.status === 1
        );
    }
    let innerClassBkBtn = "";
    let promotionHTML = "";
    const paymentStyle = getStyleByType(1);
    const installmentStyle = getStyleByType(2);
    const bnplStyle = getStyleByType(3);
    const kredivo = userConfig.kredivo.enable;
    const hcvn = userConfig.hcvn.enable;
    const muadee = userConfig.muadee.enable;
    const fundiin = userConfig.fundiin.enable;
    const promotionKredivo = configBnpl.promotion_kredivo;
    const promotionHcvn = configBnpl.promotion_hcvn;
    const promotionMuadee = configBnpl.promotion_muadee;
    const promotionFundiin = configBnpl.promotion_fundiin;

    const kredivoAmount =
        kredivo &&
        bkTotalPrice >= minAmountKredivo &&
        bkTotalPrice <= maxAmountKredivo;

    const hcvnAmount =
        hcvn && bkTotalPrice >= minAmountHcvn && bkTotalPrice <= maxAmountHcvn;

    const muadeeAmount =
        muadee &&
        bkTotalPrice >= minAmountMuadee &&
        bkTotalPrice <= maxAmountMuadee;

    const fundiinAmount =
        fundiin &&
        bkTotalPrice >= minAmountFundiin &&
        bkTotalPrice <= maxAmountFundiin;

    if (configPayment.enable && paymentStyle) {
        const minAmountPayment = configPayment.min_order_amount;
        const maxAmountPayment = configPayment.max_order_amount;
        if (bkTotalPrice >= minAmountPayment && bkTotalPrice <= maxAmountPayment) {
            const bgColorPayment =
                paymentStyle.bg_color_btn_payment || bgColorPaymentDefault;
            const txColorPayment =
                paymentStyle.tx_color_btn_payment || txColorPaymentDefault;
            innerClassBkBtn += `<button class="bk-btn-paynow" style="display: inline-block;background-color: ${bgColorPayment} !important;color: ${txColorPayment} !important" type="button">`;
            innerClassBkBtn += `<strong>${
                paymentStyle.txt_btn_integrated || "Mua ngay"
            }</strong>`;
            innerClassBkBtn += `<span>${
                paymentStyle.note_btn_integrated ||
                "Giao Tận Nơi Hoặc Nhận Tại Cửa Hàng"
            }</span>`;
            innerClassBkBtn += `</button>`;
        }
    }
    if (configInstallment.enable && installmentStyle) {
        if (bkTotalPrice >= configInstallmentLimit) {
            const bgColorInstallment =
                installmentStyle.bg_color_btn_installment ||
                bgColorInstallmentDefault;
            const txColorInstallment =
                installmentStyle.tx_color_btn_installment ||
                txColorInstallmentDefault;
            innerClassBkBtn += `<button class="bk-btn-installment" style="display: inline-block;background-color: ${bgColorInstallment} !important;color: ${txColorInstallment} !important" type="button">`;
            innerClassBkBtn += `<strong>${
                installmentStyle.txt_btn_integrated || "Trả góp qua thẻ"
            }</strong>`;
            innerClassBkBtn += `<span>${
                installmentStyle.note_btn_integrated || "Visa, Master, JCB"
            }</span>`;
            innerClassBkBtn += `</button>`;
        }
    }
    if (configBnpl.enable && bnplStyle) {
        const minAmountBnpl = configBnpl.min_order_amount;
        const maxAmountBnpl = configBnpl.max_order_amount;
        if (bkTotalPrice >= minAmountBnpl && bkTotalPrice <= maxAmountBnpl) {
            var append = `<span class="d-flex align-item-center" style="justify-content: center;">`;
            if (kredivoAmount) {
                append += `<img src="https://pc.baokim.vn/platform/img/icon-kredivo.svg" alt="" style="height: 20px !important;">`;
            }
            if (hcvnAmount) {
                append += `<img src="https://pc.baokim.vn/platform/img/home-paylater-ngang-small.svg" alt="" style="margin-left: 5px; height: 20px !important;">`;
            }
            if (muadeeAmount) {
                append += `<img src="https://pc.baokim.vn/platform/img/icon-muadee.svg" alt="" style="margin-left: 5px; height: 20px !important;">`;
            }
            if (fundiinAmount) {
                // append += `<img src="https://pc.baokim.vn/platform/img/fundiin.svg" alt="" style="margin-left: 5px; height: 20px !important;">`;
                append += `
                    <svg width="83" height="30" style="height: 20px !important" viewBox="0 0 83 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.18462 14.8809C0.983283 14.8809 0 15.862 0 17.0602C0 18.2585 0.983283 19.2396 2.18462 19.2396H5.19721C6.39854 19.2396 7.38182 18.2585 7.38182 17.0602C7.38182 15.862 6.39854 14.8809 5.19721 14.8809H2.18462Z" fill="url(#paint0_linear_4203_105665)"></path><mask id="mask0_4203_105665" maskUnits="userSpaceOnUse" x="0" y="14" width="8" height="6" style="mask-type: luminance;"><path d="M2.18462 14.8809C0.983283 14.8809 0 15.862 0 17.0602C0 18.2585 0.983283 19.2396 2.18462 19.2396H5.19721C6.39854 19.2396 7.38182 18.2585 7.38182 17.0602C7.38182 15.862 6.39854 14.8809 5.19721 14.8809H2.18462Z" fill="white"></path></mask><g mask="url(#mask0_4203_105665)"><path d="M7.38298 14.8809H0.00115967V19.2396H7.38298V14.8809Z" fill="url(#paint1_linear_4203_105665)"></path></g><path d="M25.3319 9.74984V14.0113C25.3319 14.5777 25.1745 15.0242 24.8536 15.3745C24.5368 15.7237 24.1069 15.8937 23.5401 15.8937C22.5332 15.8937 21.8626 15.5773 21.8626 14.0318V9.74984C21.8626 8.67551 21.1899 8.00879 20.1069 8.00879C19.03 8.00879 18.3615 8.67551 18.3615 9.74984V14.1158C18.3615 15.5803 18.7626 16.7888 19.5546 17.7085C20.4031 18.6978 21.5581 19.1997 22.9858 19.1997C23.9032 19.1997 24.6993 18.9856 25.3524 18.5626L25.588 18.4101L25.7824 18.6128C26.0909 18.9354 26.5383 19.1055 27.0783 19.1055C28.1552 19.1055 28.8237 18.4305 28.8237 17.3429V9.74984C28.8237 8.67551 28.1552 8.00879 27.0783 8.00879C26.0014 8.00879 25.3319 8.67551 25.3319 9.74984Z" fill="url(#paint2_linear_4203_105665)"></path><mask id="mask1_4203_105665" maskUnits="userSpaceOnUse" x="18" y="8" width="11" height="12" style="mask-type: luminance;"><path d="M25.3319 9.74984V14.0113C25.3319 14.5777 25.1745 15.0242 24.8536 15.3745C24.5368 15.7237 24.1069 15.8937 23.5401 15.8937C22.5332 15.8937 21.8626 15.5773 21.8626 14.0318V9.74984C21.8626 8.67551 21.1899 8.00879 20.1069 8.00879C19.03 8.00879 18.3615 8.67551 18.3615 9.74984V14.1158C18.3615 15.5803 18.7626 16.7888 19.5546 17.7085C20.4031 18.6978 21.5581 19.1997 22.9858 19.1997C23.9032 19.1997 24.6993 18.9856 25.3524 18.5626L25.588 18.4101L25.7824 18.6128C26.0909 18.9354 26.5383 19.1055 27.0783 19.1055C28.1552 19.1055 28.8237 18.4305 28.8237 17.3429V9.74984C28.8237 8.67551 28.1552 8.00879 27.0783 8.00879C26.0014 8.00879 25.3319 8.67551 25.3319 9.74984Z" fill="white"></path></mask><g mask="url(#mask1_4203_105665)"><path d="M28.8236 8.00879H18.3603V19.1997H28.8236V8.00879Z" fill="url(#paint3_linear_4203_105665)"></path></g><path d="M35.3344 8.64894L35.0979 8.80154L34.9045 8.59876C34.5949 8.2741 34.1424 8.10204 33.5962 8.10204C32.5193 8.10204 31.8508 8.77696 31.8508 9.86461V17.4576C31.8508 18.532 32.5193 19.1987 33.5962 19.1987C34.6793 19.1987 35.3519 18.531 35.3519 17.4576V13.2064C35.3519 12.6308 35.5052 12.1823 35.8199 11.833C36.1367 11.4838 36.5666 11.3138 37.1344 11.3138C38.1475 11.3138 38.8222 11.6323 38.8222 13.1859V17.4576C38.8222 18.532 39.4908 19.1987 40.5676 19.1987C41.6445 19.1987 42.3131 18.531 42.3131 17.4576V13.0917C42.3131 11.6282 41.9119 10.4197 41.12 9.49899C40.2786 8.5158 39.1236 8.01807 37.6888 8.01807C36.7775 8.01807 35.9845 8.23109 35.3344 8.64894Z" fill="url(#paint4_linear_4203_105665)"></path><mask id="mask2_4203_105665" maskUnits="userSpaceOnUse" x="31" y="8" width="12" height="12" style="mask-type: luminance;"><path d="M35.3344 8.64894L35.0979 8.80154L34.9045 8.59876C34.5949 8.2741 34.1424 8.10204 33.5962 8.10204C32.5193 8.10204 31.8508 8.77696 31.8508 9.86461V17.4576C31.8508 18.532 32.5193 19.1987 33.5962 19.1987C34.6793 19.1987 35.3519 18.531 35.3519 17.4576V13.2064C35.3519 12.6308 35.5052 12.1823 35.8199 11.833C36.1367 11.4838 36.5666 11.3138 37.1344 11.3138C38.1475 11.3138 38.8222 11.6323 38.8222 13.1859V17.4576C38.8222 18.532 39.4908 19.1987 40.5676 19.1987C41.6445 19.1987 42.3131 18.531 42.3131 17.4576V13.0917C42.3131 11.6282 41.9119 10.4197 41.12 9.49899C40.2786 8.5158 39.1236 8.01807 37.6888 8.01807C36.7775 8.01807 35.9845 8.23109 35.3344 8.64894Z" fill="white"></path></mask><g mask="url(#mask2_4203_105665)"><path d="M42.3153 8.01807H31.8519V19.1987H42.3153V8.01807Z" fill="url(#paint5_linear_4203_105665)"></path></g><path d="M59.54 9.84408V17.4586C59.54 18.533 60.2137 19.1997 61.2968 19.1997C62.3737 19.1997 63.0422 18.5319 63.0422 17.4586V9.84408C63.0422 8.76975 62.3737 8.10303 61.2968 8.10303C60.2127 8.102 59.54 8.76975 59.54 9.84408Z" fill="url(#paint6_linear_4203_105665)"></path><mask id="mask3_4203_105665" maskUnits="userSpaceOnUse" x="59" y="8" width="5" height="12" style="mask-type: luminance;"><path d="M59.54 9.84408V17.4586C59.54 18.533 60.2137 19.1997 61.2968 19.1997C62.3737 19.1997 63.0422 18.5319 63.0422 17.4586V9.84408C63.0422 8.76975 62.3737 8.10303 61.2968 8.10303C60.2127 8.102 59.54 8.76975 59.54 9.84408Z" fill="white"></path></mask><g mask="url(#mask3_4203_105665)"><path d="M63.0411 8.10181H59.5389V19.1995H63.0411V8.10181Z" fill="url(#paint7_linear_4203_105665)"></path></g><path d="M66.062 9.84408V17.4586C66.062 18.533 66.7347 19.1997 67.8177 19.1997C68.8946 19.1997 69.5632 18.5319 69.5632 17.4586V9.84408C69.5632 8.76975 68.8946 8.10303 67.8177 8.10303C66.7347 8.102 66.062 8.76975 66.062 9.84408Z" fill="url(#paint8_linear_4203_105665)"></path><mask id="mask4_4203_105665" maskUnits="userSpaceOnUse" x="66" y="8" width="4" height="12" style="mask-type: luminance;"><path d="M66.062 9.84408V17.4586C66.062 18.533 66.7347 19.1997 67.8177 19.1997C68.8946 19.1997 69.5632 18.5319 69.5632 17.4586V9.84408C69.5632 8.76975 68.8946 8.10303 67.8177 8.10303C66.7347 8.102 66.062 8.76975 66.062 9.84408Z" fill="white"></path></mask><g mask="url(#mask4_4203_105665)"><path d="M69.5642 8.10181H66.062V19.1995H69.5642V8.10181Z" fill="url(#paint9_linear_4203_105665)"></path></g><path d="M76.0203 8.64894L75.7838 8.80154L75.5894 8.59876C75.2798 8.2741 74.8272 8.10204 74.2821 8.10204C73.2052 8.10204 72.5356 8.77696 72.5356 9.86461V17.4576C72.5356 18.532 73.2042 19.1987 74.2821 19.1987C75.3652 19.1987 76.0378 18.531 76.0378 17.4576V13.2064C76.0378 12.6308 76.1911 12.1823 76.5058 11.833C76.8226 11.4838 77.2525 11.3138 77.8203 11.3138C78.8334 11.3138 79.5081 11.6323 79.5081 13.1859V17.4576C79.5081 18.532 80.1767 19.1987 81.2535 19.1987C82.3304 19.1987 83 18.531 83 17.4576V13.0917C83 11.6282 82.5989 10.4197 81.8069 9.49899C80.9656 8.5158 79.8105 8.01807 78.3757 8.01807C77.4623 8.01807 76.6693 8.23109 76.0203 8.64894Z" fill="url(#paint10_linear_4203_105665)"></path><mask id="mask5_4203_105665" maskUnits="userSpaceOnUse" x="72" y="8" width="11" height="12" style="mask-type: luminance;"><path d="M76.0203 8.64894L75.7838 8.80154L75.5894 8.59876C75.2798 8.2741 74.8272 8.10204 74.2821 8.10204C73.2052 8.10204 72.5356 8.77696 72.5356 9.86461V17.4576C72.5356 18.532 73.2042 19.1987 74.2821 19.1987C75.3652 19.1987 76.0378 18.531 76.0378 17.4576V13.2064C76.0378 12.6308 76.1911 12.1823 76.5058 11.833C76.8226 11.4838 77.2525 11.3138 77.8203 11.3138C78.8334 11.3138 79.5081 11.6323 79.5081 13.1859V17.4576C79.5081 18.532 80.1767 19.1987 81.2535 19.1987C82.3304 19.1987 83 18.531 83 17.4576V13.0917C83 11.6282 82.5989 10.4197 81.8069 9.49899C80.9656 8.5158 79.8105 8.01807 78.3757 8.01807C77.4623 8.01807 76.6693 8.23109 76.0203 8.64894Z" fill="white"></path></mask><g mask="url(#mask5_4203_105665)"><path d="M83.0001 8.01807H72.5368V19.1987H83.0001V8.01807Z" fill="url(#paint11_linear_4203_105665)"></path></g><path d="M49.3925 15.4022C48.9883 14.9465 48.7929 14.3443 48.7929 13.5618C48.7929 12.7732 48.9904 12.1659 49.3956 11.7081C49.7751 11.2749 50.274 11.0629 50.9209 11.0629C51.5411 11.0629 52.042 11.2995 52.4514 11.7849C52.8731 12.2775 53.0685 12.8429 53.0685 13.5608C53.0685 14.2746 52.8721 14.8389 52.4493 15.3377C52.042 15.816 51.5422 16.0485 50.9199 16.0485C50.2729 16.0505 49.7731 15.8375 49.3925 15.4022ZM53.0675 4.78895V8.61518L52.5789 8.37552C51.969 8.07647 51.2727 7.9249 50.5116 7.9249C49.0428 7.9249 47.7983 8.45234 46.8119 9.49287C45.8019 10.557 45.2897 11.9252 45.2897 13.5628C45.2897 15.1492 45.7998 16.4981 46.8057 17.5744C47.8055 18.6539 49.0531 19.2008 50.5105 19.2008C51.5144 19.2008 52.3856 18.9673 53.1025 18.5064L53.3514 18.3477L53.5437 18.5709C53.8461 18.9222 54.3038 19.1076 54.8654 19.1076C55.9165 19.1076 56.5697 18.4398 56.5697 17.3655V4.78895C56.5697 3.71462 55.9011 3.04688 54.8242 3.04688C53.7412 3.04688 53.0675 3.71462 53.0675 4.78895Z" fill="url(#paint12_linear_4203_105665)"></path><mask id="mask6_4203_105665" maskUnits="userSpaceOnUse" x="45" y="3" width="12" height="17" style="mask-type: luminance;"><path d="M49.3925 15.4022C48.9883 14.9465 48.7929 14.3443 48.7929 13.5618C48.7929 12.7732 48.9904 12.1659 49.3956 11.7081C49.7751 11.2749 50.274 11.0629 50.9209 11.0629C51.5411 11.0629 52.042 11.2995 52.4514 11.7849C52.8731 12.2775 53.0685 12.8429 53.0685 13.5608C53.0685 14.2746 52.8721 14.8389 52.4493 15.3377C52.042 15.816 51.5422 16.0485 50.9199 16.0485C50.2729 16.0505 49.7731 15.8375 49.3925 15.4022ZM53.0675 4.78895V8.61518L52.5789 8.37552C51.969 8.07647 51.2727 7.9249 50.5116 7.9249C49.0428 7.9249 47.7983 8.45234 46.8119 9.49287C45.8019 10.557 45.2897 11.9252 45.2897 13.5628C45.2897 15.1492 45.7998 16.4981 46.8057 17.5744C47.8055 18.6539 49.0531 19.2008 50.5105 19.2008C51.5144 19.2008 52.3856 18.9673 53.1025 18.5064L53.3514 18.3477L53.5437 18.5709C53.8461 18.9222 54.3038 19.1076 54.8654 19.1076C55.9165 19.1076 56.5697 18.4398 56.5697 17.3655V4.78895C56.5697 3.71462 55.9011 3.04688 54.8242 3.04688C53.7412 3.04688 53.0675 3.71462 53.0675 4.78895Z" fill="white"></path></mask><g mask="url(#mask6_4203_105665)"><path d="M56.5697 3.04688H45.2897V19.1987H56.5697V3.04688Z" fill="url(#paint13_linear_4203_105665)"></path></g><path d="M2.18462 7.44243L2.07251 7.44448C0.922599 7.50286 0 8.45941 0 9.6208C0 10.8191 0.983283 11.8002 2.18462 11.8002H12.2777L12.3898 11.7971C13.5397 11.7387 14.4623 10.7812 14.4623 9.6208C14.4623 8.42254 13.48 7.44141 12.2777 7.44141H2.18462H12.2777H2.18462V7.44243Z" fill="url(#paint14_linear_4203_105665)"></path><mask id="mask7_4203_105665" maskUnits="userSpaceOnUse" x="0" y="7" width="15" height="5" style="mask-type: luminance;"><path d="M2.18462 7.44243L2.07251 7.44448C0.922599 7.50286 0 8.45941 0 9.6208C0 10.8191 0.983283 11.8002 2.18462 11.8002H12.2777L12.3898 11.7971C13.5397 11.7387 14.4623 10.7812 14.4623 9.6208C14.4623 8.42254 13.48 7.44141 12.2777 7.44141H2.18462H12.2777H2.18462V7.44243Z" fill="white"></path></mask><g mask="url(#mask7_4203_105665)"><path d="M14.4624 7.44263H0.00115967V11.8014H14.4624V7.44263Z" fill="url(#paint15_linear_4203_105665)"></path></g><path d="M59.7128 4.91591C59.7128 5.90421 60.3042 6.49412 61.2947 6.49412C62.2646 6.49412 62.8684 5.88885 62.8684 4.91591C62.8684 3.94194 62.2646 3.33667 61.2947 3.33667C60.3042 3.33769 59.7128 3.92761 59.7128 4.91591Z" fill="url(#paint16_linear_4203_105665)"></path><mask id="mask8_4203_105665" maskUnits="userSpaceOnUse" x="59" y="3" width="4" height="4" style="mask-type: luminance;"><path d="M59.7128 4.91591C59.7128 5.90421 60.3042 6.49412 61.2947 6.49412C62.2646 6.49412 62.8684 5.88885 62.8684 4.91591C62.8684 3.94194 62.2646 3.33667 61.2947 3.33667C60.3042 3.33769 59.7128 3.92761 59.7128 4.91591Z" fill="white"></path></mask><g mask="url(#mask8_4203_105665)"><path d="M62.8684 3.33789H59.7128V6.49534H62.8684V3.33789Z" fill="url(#paint17_linear_4203_105665)"></path></g><path d="M66.2348 4.91591C66.2348 5.90421 66.8262 6.49412 67.8167 6.49412C68.7876 6.49412 69.3904 5.88885 69.3904 4.91591C69.3904 3.94194 68.7876 3.33667 67.8167 3.33667C66.8272 3.33769 66.2348 3.92761 66.2348 4.91591Z" fill="url(#paint18_linear_4203_105665)"></path><mask id="mask9_4203_105665" maskUnits="userSpaceOnUse" x="66" y="3" width="4" height="4" style="mask-type: luminance;"><path d="M66.2348 4.91591C66.2348 5.90421 66.8262 6.49412 67.8167 6.49412C68.7876 6.49412 69.3904 5.88885 69.3904 4.91591C69.3904 3.94194 68.7876 3.33667 67.8167 3.33667C66.8272 3.33769 66.2348 3.92761 66.2348 4.91591Z" fill="white"></path></mask><g mask="url(#mask9_4203_105665)"><path d="M69.3904 3.33789H66.2348V6.49534H69.3904V3.33789Z" fill="url(#paint19_linear_4203_105665)"></path></g><path d="M2.18462 0L2.07251 0.00307232C0.9226 0.0614488 0 1.018 0 2.17939C0 3.37764 0.983283 4.35878 2.18462 4.35878H18.3028L18.415 4.35571C19.5649 4.29733 20.4875 3.34078 20.4875 2.17939C20.4875 0.981135 19.5052 0 18.3028 0H2.18462Z" fill="url(#paint20_linear_4203_105665)"></path><mask id="mask10_4203_105665" maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="5" style="mask-type: luminance;"><path d="M2.18462 0L2.07251 0.00307232C0.9226 0.0614488 0 1.018 0 2.17939C0 3.37764 0.983283 4.35878 2.18462 4.35878H18.3028L18.415 4.35571C19.5649 4.29733 20.4875 3.34078 20.4875 2.17939C20.4875 0.981135 19.5052 0 18.3028 0H2.18462Z" fill="white"></path></mask><g mask="url(#mask10_4203_105665)"><path d="M20.4886 0H0.00115967V4.35775H20.4886V0Z" fill="url(#paint21_linear_4203_105665)"></path></g><path d="M21.3731 25.8014V27.8865H20.2458V22.2681H22.2998C22.6413 22.2681 22.9375 22.3111 23.1905 22.3951C23.4435 22.4801 23.6523 22.6009 23.8179 22.7576C23.9825 22.9143 24.1069 23.1007 24.1892 23.3188C24.2715 23.536 24.3137 23.7777 24.3137 24.0429C24.3137 24.303 24.2705 24.5407 24.1861 24.7547C24.1008 24.9698 23.9732 25.1551 23.8025 25.3118C23.6317 25.4685 23.4219 25.5894 23.171 25.6744C22.921 25.7594 22.6299 25.8014 22.2998 25.8014H21.3731ZM22.1805 24.9022C22.5487 24.9022 22.8048 24.8233 22.9519 24.6666C23.0979 24.5099 23.172 24.3 23.172 24.0388C23.172 23.7674 23.099 23.5534 22.9519 23.3987C22.8048 23.2441 22.5487 23.1673 22.1805 23.1673H21.3731V24.9022H22.1805Z" fill="black"></path><path d="M27.5824 23.4224C27.966 23.4224 28.29 23.5115 28.5533 23.6907C28.8166 23.8699 29.0017 24.1014 29.1087 24.3851V23.4777H30.236V27.8866H29.1087L29.1149 26.9639C29.0079 27.2558 28.8228 27.4923 28.5584 27.6726C28.2941 27.8528 27.9701 27.943 27.5854 27.943C27.3077 27.943 27.0485 27.8918 26.8089 27.7873C26.5682 27.6838 26.3605 27.5353 26.1846 27.3418C26.0087 27.1482 25.8709 26.9116 25.7721 26.6331C25.6734 26.3545 25.624 26.037 25.624 25.6816C25.624 25.3263 25.6734 25.0088 25.7721 24.7302C25.8709 24.4516 26.0077 24.2161 26.1835 24.0225C26.3594 23.8289 26.5672 23.6804 26.8068 23.577C27.0475 23.4736 27.3057 23.4224 27.5824 23.4224ZM27.9341 24.3933C27.5875 24.3933 27.3067 24.5049 27.0907 24.7292C26.8747 24.9524 26.7667 25.2689 26.7667 25.6796C26.7667 26.0841 26.8747 26.3975 27.0907 26.6218C27.3067 26.8451 27.5875 26.9567 27.9341 26.9567C28.1049 26.9567 28.2602 26.927 28.4021 26.8686C28.543 26.8103 28.6675 26.7252 28.7734 26.6136C28.8793 26.502 28.9627 26.3678 29.0213 26.2101C29.0799 26.0534 29.1087 25.8762 29.1087 25.6796C29.1087 25.4768 29.0789 25.2976 29.0213 25.1409C28.9627 24.9842 28.8804 24.85 28.7734 24.7374C28.6664 24.6247 28.543 24.5407 28.4021 24.4824C28.2612 24.4219 28.1049 24.3933 27.9341 24.3933Z" fill="black"></path><path d="M32.8094 23.4776L34.0159 26.4701L35.1349 23.4776H36.3733L33.6641 29.9871H32.4175L33.4162 27.7585L31.5546 23.4766H32.8094V23.4776Z" fill="black"></path><path d="M41.3607 27.0273H43.2553V27.8865H40.2344V22.2681H41.3617V27.0273H41.3607Z" fill="black"></path><path d="M46.4602 23.4224C46.8438 23.4224 47.1678 23.5115 47.4311 23.6907C47.6944 23.8699 47.8796 24.1014 47.9865 24.3851V23.4777H49.1138V27.8866H47.9865L47.9927 26.9639C47.8857 27.2558 47.7006 27.4923 47.4363 27.6726C47.1719 27.8528 46.8479 27.943 46.4633 27.943C46.1856 27.943 45.9264 27.8918 45.6867 27.7873C45.446 27.6838 45.2383 27.5353 45.0624 27.3418C44.8865 27.1482 44.7487 26.9116 44.6499 26.6331C44.5512 26.3545 44.5018 26.037 44.5018 25.6816C44.5018 25.3263 44.5512 25.0088 44.6499 24.7302C44.7487 24.4516 44.8855 24.2161 45.0614 24.0225C45.2372 23.8289 45.445 23.6804 45.6847 23.577C45.9243 23.4736 46.1825 23.4224 46.4602 23.4224ZM46.8119 24.3933C46.4653 24.3933 46.1845 24.5049 45.9685 24.7292C45.7525 24.9524 45.6445 25.2689 45.6445 25.6796C45.6445 26.0841 45.7525 26.3975 45.9685 26.6218C46.1845 26.8451 46.4653 26.9567 46.8119 26.9567C46.9827 26.9567 47.138 26.927 47.2799 26.8686C47.4208 26.8103 47.5453 26.7252 47.6512 26.6136C47.7572 26.502 47.8405 26.3678 47.8991 26.2101C47.9577 26.0534 47.9865 25.8762 47.9865 25.6796C47.9865 25.4768 47.9567 25.2976 47.8991 25.1409C47.8405 24.9842 47.7582 24.85 47.6512 24.7374C47.5442 24.6247 47.4208 24.5407 47.2799 24.4824C47.138 24.4219 46.9816 24.3933 46.8119 24.3933Z" fill="black"></path><path d="M53.2938 26.9157V27.8866H52.7024C52.473 27.8866 52.2642 27.86 52.075 27.8068C51.8857 27.7535 51.7232 27.6675 51.5874 27.5477C51.4517 27.4278 51.3478 27.2691 51.2758 27.0704C51.2038 26.8717 51.1678 26.6259 51.1678 26.334V24.424H50.5517V23.4767H51.1668V22.387H52.294V23.4767H53.2856V24.424H52.294V26.3433C52.294 26.5604 52.3372 26.7099 52.4226 26.7918C52.508 26.8738 52.652 26.9147 52.8536 26.9147H53.2938V26.9157Z" fill="black"></path><path d="M59.0557 25.5145C59.0557 25.5893 59.0515 25.6548 59.0433 25.7132C59.0351 25.7716 59.0258 25.833 59.0155 25.8965H55.7787C55.789 26.1085 55.824 26.2877 55.8826 26.4342C55.9412 26.5796 56.0184 26.6984 56.114 26.7885C56.2097 26.8787 56.3197 26.9432 56.4452 26.9831C56.5707 27.0231 56.6993 27.0425 56.832 27.0425C57.0973 27.0425 57.3154 26.978 57.4851 26.8479C57.6548 26.7179 57.7638 26.5468 57.8122 26.3348H59.0001C58.9569 26.5632 58.8767 26.7752 58.7564 26.9719C58.637 27.1685 58.4848 27.3375 58.3017 27.4809C58.1187 27.6243 57.9068 27.7369 57.6671 27.8188C57.4275 27.9008 57.1673 27.9428 56.8854 27.9428C56.5614 27.9428 56.2642 27.8916 55.9958 27.7871C55.7273 27.6837 55.4949 27.5352 55.2974 27.3416C55.0999 27.148 54.9477 26.9104 54.8386 26.6288C54.7296 26.3482 54.6751 26.0317 54.6751 25.6814C54.6751 25.3261 54.7296 25.0086 54.8386 24.73C54.9477 24.4514 55.1009 24.2159 55.2974 24.0223C55.4938 23.8288 55.7263 23.6803 55.9958 23.5768C56.2642 23.4734 56.5614 23.4211 56.8854 23.4211C57.2207 23.4211 57.5211 23.4734 57.7864 23.5768C58.0528 23.6803 58.2801 23.8257 58.4684 24.0141C58.6576 24.2026 58.8016 24.4238 58.9034 24.6788C59.0053 24.9338 59.0557 25.2124 59.0557 25.5145ZM57.9284 25.4039C57.9387 25.2134 57.915 25.0475 57.8564 24.9062C57.7978 24.7659 57.7206 24.6511 57.625 24.5641C57.5293 24.477 57.4172 24.4115 57.2897 24.3695C57.1621 24.3275 57.0284 24.306 56.8896 24.306C56.6016 24.306 56.3516 24.3951 56.1387 24.5723C55.9258 24.7505 55.8055 25.027 55.7787 25.4039H57.9284Z" fill="black"></path><path d="M61.7813 24.3215C61.9407 24.0511 62.1557 23.8319 62.4241 23.665C62.6936 23.498 63.0011 23.4141 63.3477 23.4141V24.6154H63.0207C62.8448 24.6154 62.6823 24.6338 62.5331 24.6707C62.384 24.7076 62.2534 24.77 62.1413 24.8581C62.0292 24.9452 61.9417 25.064 61.8769 25.2125C61.8132 25.361 61.7813 25.5443 61.7813 25.7614V27.8865H60.654V23.4776H61.7813V24.3215Z" fill="black"></path><defs><linearGradient id="paint0_linear_4203_105665" x1="3.69165" y1="18.7609" x2="3.69165" y2="4.58294" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint1_linear_4203_105665" x1="3.69175" y1="18.7609" x2="3.69175" y2="4.58294" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint2_linear_4203_105665" x1="23.5919" y1="18.7609" x2="23.5919" y2="4.58292" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint3_linear_4203_105665" x1="23.5917" y1="18.7609" x2="23.5917" y2="4.58292" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint4_linear_4203_105665" x1="37.0834" y1="18.7609" x2="37.0834" y2="4.58298" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint5_linear_4203_105665" x1="37.0835" y1="18.7609" x2="37.0835" y2="4.58298" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint6_linear_4203_105665" x1="61.2905" y1="18.7609" x2="61.2905" y2="4.58293" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint7_linear_4203_105665" x1="61.2904" y1="18.7607" x2="61.2904" y2="4.58274" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint8_linear_4203_105665" x1="67.813" y1="18.7609" x2="67.813" y2="4.58293" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint9_linear_4203_105665" x1="67.813" y1="18.7607" x2="67.813" y2="4.58274" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint10_linear_4203_105665" x1="77.7685" y1="18.7609" x2="77.7685" y2="4.58298" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint11_linear_4203_105665" x1="77.7687" y1="18.7609" x2="77.7687" y2="4.58298" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint12_linear_4203_105665" x1="50.9297" y1="18.761" x2="50.9297" y2="4.58301" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint13_linear_4203_105665" x1="50.9297" y1="18.761" x2="50.9297" y2="4.58301" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint14_linear_4203_105665" x1="7.2316" y1="18.7609" x2="7.2316" y2="4.58291" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint15_linear_4203_105665" x1="7.23171" y1="18.7611" x2="7.23171" y2="4.58311" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint16_linear_4203_105665" x1="61.2908" y1="18.7609" x2="61.2908" y2="4.58297" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint17_linear_4203_105665" x1="61.2908" y1="18.7611" x2="61.2908" y2="4.58316" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint18_linear_4203_105665" x1="67.8131" y1="18.7609" x2="67.8131" y2="4.58297" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint19_linear_4203_105665" x1="67.8131" y1="18.7611" x2="67.8131" y2="4.58316" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint20_linear_4203_105665" x1="10.2443" y1="18.7609" x2="10.2443" y2="4.58298" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint21_linear_4203_105665" x1="10.2444" y1="18.7609" x2="10.2444" y2="4.58297" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient></defs></svg>
                `;
            }
            append += `</span>`;
            const bgColorBnpl =
                bnplStyle.bg_color_btn_insta || bgColorBnplDefault;
            const txColorBnpl =
                bnplStyle.tx_color_btn_insta || txColorBnplDefault;
            innerClassBkBtn += `<button class="bk-btn-installment-amigo" style="display: inline-block;background-color: ${bgColorBnpl} !important;color: ${txColorBnpl} !important" type="button">`;
            innerClassBkBtn += `<strong>${
                bnplStyle.txt_btn_integrated || "Mua ngay - trả sau"
            }</strong>`;
            innerClassBkBtn += append;
            innerClassBkBtn += `</button>`;

            const activePromotions = [];

            if (promotionKredivo.enable && kredivoAmount) {
                activePromotions.push({
                    type: "kredivo",
                    amount: kredivoAmount,
                });
            }
            if (promotionHcvn.enable && hcvnAmount) {
                activePromotions.push({ type: "hcvn", amount: hcvnAmount });
            }
            if (promotionMuadee.enable && muadeeAmount) {
                activePromotions.push({ type: "muadee", amount: muadeeAmount });
            }
            if (promotionFundiin.enable && fundiinAmount) {
                activePromotions.push({
                    type: "fundiin",
                    amount: fundiinAmount,
                });
            }

            if (activePromotions.length > 0) {
                promotionHTML += generatePromotionFromArray(activePromotions);
            }

            // Đối với hàm generatePromotion mới nhận 4 tham số
            function generatePromotionFromArray(promotions) {
                const kredivoAmount =
                    promotions.find((p) => p.type === "kredivo")?.amount ||
                    null;
                const hcvnAmount =
                    promotions.find((p) => p.type === "hcvn")?.amount || null;
                const muadeeAmount =
                    promotions.find((p) => p.type === "muadee")?.amount || null;
                const fundiinAmount =
                    promotions.find((p) => p.type === "fundiin")?.amount ||
                    null;

                // Gọi hàm generatePromotion với 4 tham số
                return generatePromotion(
                    kredivoAmount,
                    hcvnAmount,
                    muadeeAmount,
                    fundiinAmount
                );
            }
        }
    }
    bkBtnContentElement.innerHTML = innerClassBkBtn;

    const promotionContainer = bkBtnContentElement.closest(".bk-btn");
    if (
        promotionContainer &&
        !promotionContainer.querySelector(".bk-promotion")
    ) {
        promotionContainer.insertAdjacentHTML("beforeend", promotionHTML);
    }
}

function attachButtonClickEvents() {
    const buttonConfig = {
        "bk-btn-paynow": "",
        "bk-btn-installment": "/installment",
        "bk-btn-installment-amigo": "/buy-now-pay-later",
    };

    Object.entries(buttonConfig).forEach(([className, path]) => {
        const buttons = document.getElementsByClassName(className);
        Array.from(buttons).forEach((button) => {
            if (!button.dataset.clickEventAttached) {
                button.addEventListener("click", function () {
                    // getData();
                    clickToPay(this, path);
                });
                button.dataset.clickEventAttached = true;
            }
        });
    });
}

function generateOrderData() {
    console.log("initialProductData: ", initialProductData);
    const products = initialProductData.productNames.map((name, index) => ({
        name: name,
        image: initialProductData.productImages[index],
        quantity: initialProductData.productQuantities[index],
        price: initialProductData.productPrices[index],
        platform_product_id: initialProductData.platformProductId,
        platform_variant_id: initialProductData.platformVariantId,
        // platform_variant_id: "xxxxyyyy",
    }));

    console.log("products: ", products);
    const tokenIssuedAt = new Date(); // Thời gian hiện tại
    const tokenExpired = new Date(
        tokenIssuedAt.getTime() + 24 * 60 * 60 * 1000
    ); // Thêm 1 ngày

    const formatDate = (date) => {
        const pad = (n) => (n < 10 ? "0" + n : n); // Thêm số 0 cho ngày/tháng/giờ
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
        )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
            date.getSeconds()
        )}`;
    };

    console.log("Token Expired:", formatDate(tokenExpired));
    const formatExpired = formatDate(tokenExpired);

    const merchantCode = userConfig.merchant_code;
    const logoMrc = configMrc.data.user.logo;

    return {
        products: products,
        domain: currentDomain,
        merchantLogo: logoMrc,
        productProperty: productProperty,
        tokenExpired: formatExpired,
        merchantCode: merchantCode,
    };
}

function genDataToken(uri = "") {
    var baseUrl = urlPopup + uri + "?token=" + token;
    console.log("baseUrl: ", baseUrl);
    return baseUrl;
}

function clickToPay(currentElement, path = "") {
    var iframe = document.getElementById("iframe");
    if (!token) {
        getData();
    }
    createToken(generateOrderData());
    configModal(currentElement);

    var modalB2B = document.getElementById("bk-modal-b2b");
    var modalPayment = modalB2B.querySelector("#bk-modal-payment");

    var isSafari =
        navigator.vendor &&
        navigator.vendor.indexOf("Apple") > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf("CriOS") == -1 &&
        navigator.userAgent.indexOf("FxiOS") == -1;
    var urlPopup = genDataToken(path);
    console.log("url popup: ", urlPopup);
    if (isSafari == false) {
        if (window.mobileCheck()) {
            console.log("Bạn đang sử dụng thiết bị di động.");
            // if (currentElement.className == 'bk-btn-paynow') {
            //     console.log(1);
            //     window.open(urlPopup);
            // } else if (currentElement.className == 'bk-btn-installment') {
            //     console.log(2);
            //     window.open(urlPopup);
            // } else if (currentElement.className == 'bk-btn-installment-amigo') {
            //     console.log(3);
            //     window.open(urlPopup);
            // } else {
            iframe.setAttribute("src", urlPopup);
            modalPayment.style.display = "block";
            modalPayment.classList.remove("hide");
            styleBody();
            // }
        } else {
            console.log("Bạn đang sử dụng máy tính.");
            iframe.setAttribute("src", urlPopup);
            modalPayment.style.display = "block";
            modalPayment.classList.remove("hide");
            styleBody();
        }
    } else {
        window.open(urlPopup);
    }
}

function createPromotionItem(imgSrc, description, highlight = null) {
    return `
    <li>
        <img style="margin-top: 6px; width: 35px !important;" src="${imgSrc}" alt="">
        <div>
            <p>${description}</p>
        </div>
        ${
            highlight
                ? `<span><img style="margin-right: 4px;" src="https://pc.baokim.vn/platform/img/fire-promotion.svg" alt="">${highlight}</span>`
                : ""
        }
    </li>`;
}

function generatePromotion(isKredivo, isHcvn, isMuadee, isFundiin) {
    let innerClassBkBtn = '<div class="bk-promotion">';
    innerClassBkBtn += '    <div class="bk-promotion-title">';
    innerClassBkBtn +=
        '        <div class="d-flex align-items-center justify-content-center">';
    innerClassBkBtn += "            <p>ƯU ĐÃI KHI THANH TOÁN</p>";
    if (isKredivo) {
        innerClassBkBtn +=
            '            <img src="https://pc.baokim.vn/platform/img/icon-kredivo.svg" style="height: 20px !important;" alt="">';
    }
    if (isHcvn) {
        innerClassBkBtn +=
            '            <a href="https://www.homepaylater.vn/?utm_source=" style="cursor: pointer" target="_blank"><img src="https://pc.baokim.vn/platform/img/home-paylater-ngang-small.svg" style="height: 20px !important;" alt=""></a>';
    }
    if (isMuadee) {
        innerClassBkBtn +=
            '            <img src="https://pc.baokim.vn/platform/img/icon-muadee.svg" style="height: 20px !important;" alt="">';
    }
    if (isFundiin) {
        innerClassBkBtn +=
            // '            <img src="https://pc.baokim.vn/platform/img/fundiin.svg" style="height: 20px !important;" alt="">';
        '<svg width="83" height="30" style="height: 20px !important" viewBox="0 0 83 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.18462 14.8809C0.983283 14.8809 0 15.862 0 17.0602C0 18.2585 0.983283 19.2396 2.18462 19.2396H5.19721C6.39854 19.2396 7.38182 18.2585 7.38182 17.0602C7.38182 15.862 6.39854 14.8809 5.19721 14.8809H2.18462Z" fill="url(#paint0_linear_4203_105665)"></path><mask id="mask0_4203_105665" maskUnits="userSpaceOnUse" x="0" y="14" width="8" height="6" style="mask-type: luminance;"><path d="M2.18462 14.8809C0.983283 14.8809 0 15.862 0 17.0602C0 18.2585 0.983283 19.2396 2.18462 19.2396H5.19721C6.39854 19.2396 7.38182 18.2585 7.38182 17.0602C7.38182 15.862 6.39854 14.8809 5.19721 14.8809H2.18462Z" fill="white"></path></mask><g mask="url(#mask0_4203_105665)"><path d="M7.38298 14.8809H0.00115967V19.2396H7.38298V14.8809Z" fill="url(#paint1_linear_4203_105665)"></path></g><path d="M25.3319 9.74984V14.0113C25.3319 14.5777 25.1745 15.0242 24.8536 15.3745C24.5368 15.7237 24.1069 15.8937 23.5401 15.8937C22.5332 15.8937 21.8626 15.5773 21.8626 14.0318V9.74984C21.8626 8.67551 21.1899 8.00879 20.1069 8.00879C19.03 8.00879 18.3615 8.67551 18.3615 9.74984V14.1158C18.3615 15.5803 18.7626 16.7888 19.5546 17.7085C20.4031 18.6978 21.5581 19.1997 22.9858 19.1997C23.9032 19.1997 24.6993 18.9856 25.3524 18.5626L25.588 18.4101L25.7824 18.6128C26.0909 18.9354 26.5383 19.1055 27.0783 19.1055C28.1552 19.1055 28.8237 18.4305 28.8237 17.3429V9.74984C28.8237 8.67551 28.1552 8.00879 27.0783 8.00879C26.0014 8.00879 25.3319 8.67551 25.3319 9.74984Z" fill="url(#paint2_linear_4203_105665)"></path><mask id="mask1_4203_105665" maskUnits="userSpaceOnUse" x="18" y="8" width="11" height="12" style="mask-type: luminance;"><path d="M25.3319 9.74984V14.0113C25.3319 14.5777 25.1745 15.0242 24.8536 15.3745C24.5368 15.7237 24.1069 15.8937 23.5401 15.8937C22.5332 15.8937 21.8626 15.5773 21.8626 14.0318V9.74984C21.8626 8.67551 21.1899 8.00879 20.1069 8.00879C19.03 8.00879 18.3615 8.67551 18.3615 9.74984V14.1158C18.3615 15.5803 18.7626 16.7888 19.5546 17.7085C20.4031 18.6978 21.5581 19.1997 22.9858 19.1997C23.9032 19.1997 24.6993 18.9856 25.3524 18.5626L25.588 18.4101L25.7824 18.6128C26.0909 18.9354 26.5383 19.1055 27.0783 19.1055C28.1552 19.1055 28.8237 18.4305 28.8237 17.3429V9.74984C28.8237 8.67551 28.1552 8.00879 27.0783 8.00879C26.0014 8.00879 25.3319 8.67551 25.3319 9.74984Z" fill="white"></path></mask><g mask="url(#mask1_4203_105665)"><path d="M28.8236 8.00879H18.3603V19.1997H28.8236V8.00879Z" fill="url(#paint3_linear_4203_105665)"></path></g><path d="M35.3344 8.64894L35.0979 8.80154L34.9045 8.59876C34.5949 8.2741 34.1424 8.10204 33.5962 8.10204C32.5193 8.10204 31.8508 8.77696 31.8508 9.86461V17.4576C31.8508 18.532 32.5193 19.1987 33.5962 19.1987C34.6793 19.1987 35.3519 18.531 35.3519 17.4576V13.2064C35.3519 12.6308 35.5052 12.1823 35.8199 11.833C36.1367 11.4838 36.5666 11.3138 37.1344 11.3138C38.1475 11.3138 38.8222 11.6323 38.8222 13.1859V17.4576C38.8222 18.532 39.4908 19.1987 40.5676 19.1987C41.6445 19.1987 42.3131 18.531 42.3131 17.4576V13.0917C42.3131 11.6282 41.9119 10.4197 41.12 9.49899C40.2786 8.5158 39.1236 8.01807 37.6888 8.01807C36.7775 8.01807 35.9845 8.23109 35.3344 8.64894Z" fill="url(#paint4_linear_4203_105665)"></path><mask id="mask2_4203_105665" maskUnits="userSpaceOnUse" x="31" y="8" width="12" height="12" style="mask-type: luminance;"><path d="M35.3344 8.64894L35.0979 8.80154L34.9045 8.59876C34.5949 8.2741 34.1424 8.10204 33.5962 8.10204C32.5193 8.10204 31.8508 8.77696 31.8508 9.86461V17.4576C31.8508 18.532 32.5193 19.1987 33.5962 19.1987C34.6793 19.1987 35.3519 18.531 35.3519 17.4576V13.2064C35.3519 12.6308 35.5052 12.1823 35.8199 11.833C36.1367 11.4838 36.5666 11.3138 37.1344 11.3138C38.1475 11.3138 38.8222 11.6323 38.8222 13.1859V17.4576C38.8222 18.532 39.4908 19.1987 40.5676 19.1987C41.6445 19.1987 42.3131 18.531 42.3131 17.4576V13.0917C42.3131 11.6282 41.9119 10.4197 41.12 9.49899C40.2786 8.5158 39.1236 8.01807 37.6888 8.01807C36.7775 8.01807 35.9845 8.23109 35.3344 8.64894Z" fill="white"></path></mask><g mask="url(#mask2_4203_105665)"><path d="M42.3153 8.01807H31.8519V19.1987H42.3153V8.01807Z" fill="url(#paint5_linear_4203_105665)"></path></g><path d="M59.54 9.84408V17.4586C59.54 18.533 60.2137 19.1997 61.2968 19.1997C62.3737 19.1997 63.0422 18.5319 63.0422 17.4586V9.84408C63.0422 8.76975 62.3737 8.10303 61.2968 8.10303C60.2127 8.102 59.54 8.76975 59.54 9.84408Z" fill="url(#paint6_linear_4203_105665)"></path><mask id="mask3_4203_105665" maskUnits="userSpaceOnUse" x="59" y="8" width="5" height="12" style="mask-type: luminance;"><path d="M59.54 9.84408V17.4586C59.54 18.533 60.2137 19.1997 61.2968 19.1997C62.3737 19.1997 63.0422 18.5319 63.0422 17.4586V9.84408C63.0422 8.76975 62.3737 8.10303 61.2968 8.10303C60.2127 8.102 59.54 8.76975 59.54 9.84408Z" fill="white"></path></mask><g mask="url(#mask3_4203_105665)"><path d="M63.0411 8.10181H59.5389V19.1995H63.0411V8.10181Z" fill="url(#paint7_linear_4203_105665)"></path></g><path d="M66.062 9.84408V17.4586C66.062 18.533 66.7347 19.1997 67.8177 19.1997C68.8946 19.1997 69.5632 18.5319 69.5632 17.4586V9.84408C69.5632 8.76975 68.8946 8.10303 67.8177 8.10303C66.7347 8.102 66.062 8.76975 66.062 9.84408Z" fill="url(#paint8_linear_4203_105665)"></path><mask id="mask4_4203_105665" maskUnits="userSpaceOnUse" x="66" y="8" width="4" height="12" style="mask-type: luminance;"><path d="M66.062 9.84408V17.4586C66.062 18.533 66.7347 19.1997 67.8177 19.1997C68.8946 19.1997 69.5632 18.5319 69.5632 17.4586V9.84408C69.5632 8.76975 68.8946 8.10303 67.8177 8.10303C66.7347 8.102 66.062 8.76975 66.062 9.84408Z" fill="white"></path></mask><g mask="url(#mask4_4203_105665)"><path d="M69.5642 8.10181H66.062V19.1995H69.5642V8.10181Z" fill="url(#paint9_linear_4203_105665)"></path></g><path d="M76.0203 8.64894L75.7838 8.80154L75.5894 8.59876C75.2798 8.2741 74.8272 8.10204 74.2821 8.10204C73.2052 8.10204 72.5356 8.77696 72.5356 9.86461V17.4576C72.5356 18.532 73.2042 19.1987 74.2821 19.1987C75.3652 19.1987 76.0378 18.531 76.0378 17.4576V13.2064C76.0378 12.6308 76.1911 12.1823 76.5058 11.833C76.8226 11.4838 77.2525 11.3138 77.8203 11.3138C78.8334 11.3138 79.5081 11.6323 79.5081 13.1859V17.4576C79.5081 18.532 80.1767 19.1987 81.2535 19.1987C82.3304 19.1987 83 18.531 83 17.4576V13.0917C83 11.6282 82.5989 10.4197 81.8069 9.49899C80.9656 8.5158 79.8105 8.01807 78.3757 8.01807C77.4623 8.01807 76.6693 8.23109 76.0203 8.64894Z" fill="url(#paint10_linear_4203_105665)"></path><mask id="mask5_4203_105665" maskUnits="userSpaceOnUse" x="72" y="8" width="11" height="12" style="mask-type: luminance;"><path d="M76.0203 8.64894L75.7838 8.80154L75.5894 8.59876C75.2798 8.2741 74.8272 8.10204 74.2821 8.10204C73.2052 8.10204 72.5356 8.77696 72.5356 9.86461V17.4576C72.5356 18.532 73.2042 19.1987 74.2821 19.1987C75.3652 19.1987 76.0378 18.531 76.0378 17.4576V13.2064C76.0378 12.6308 76.1911 12.1823 76.5058 11.833C76.8226 11.4838 77.2525 11.3138 77.8203 11.3138C78.8334 11.3138 79.5081 11.6323 79.5081 13.1859V17.4576C79.5081 18.532 80.1767 19.1987 81.2535 19.1987C82.3304 19.1987 83 18.531 83 17.4576V13.0917C83 11.6282 82.5989 10.4197 81.8069 9.49899C80.9656 8.5158 79.8105 8.01807 78.3757 8.01807C77.4623 8.01807 76.6693 8.23109 76.0203 8.64894Z" fill="white"></path></mask><g mask="url(#mask5_4203_105665)"><path d="M83.0001 8.01807H72.5368V19.1987H83.0001V8.01807Z" fill="url(#paint11_linear_4203_105665)"></path></g><path d="M49.3925 15.4022C48.9883 14.9465 48.7929 14.3443 48.7929 13.5618C48.7929 12.7732 48.9904 12.1659 49.3956 11.7081C49.7751 11.2749 50.274 11.0629 50.9209 11.0629C51.5411 11.0629 52.042 11.2995 52.4514 11.7849C52.8731 12.2775 53.0685 12.8429 53.0685 13.5608C53.0685 14.2746 52.8721 14.8389 52.4493 15.3377C52.042 15.816 51.5422 16.0485 50.9199 16.0485C50.2729 16.0505 49.7731 15.8375 49.3925 15.4022ZM53.0675 4.78895V8.61518L52.5789 8.37552C51.969 8.07647 51.2727 7.9249 50.5116 7.9249C49.0428 7.9249 47.7983 8.45234 46.8119 9.49287C45.8019 10.557 45.2897 11.9252 45.2897 13.5628C45.2897 15.1492 45.7998 16.4981 46.8057 17.5744C47.8055 18.6539 49.0531 19.2008 50.5105 19.2008C51.5144 19.2008 52.3856 18.9673 53.1025 18.5064L53.3514 18.3477L53.5437 18.5709C53.8461 18.9222 54.3038 19.1076 54.8654 19.1076C55.9165 19.1076 56.5697 18.4398 56.5697 17.3655V4.78895C56.5697 3.71462 55.9011 3.04688 54.8242 3.04688C53.7412 3.04688 53.0675 3.71462 53.0675 4.78895Z" fill="url(#paint12_linear_4203_105665)"></path><mask id="mask6_4203_105665" maskUnits="userSpaceOnUse" x="45" y="3" width="12" height="17" style="mask-type: luminance;"><path d="M49.3925 15.4022C48.9883 14.9465 48.7929 14.3443 48.7929 13.5618C48.7929 12.7732 48.9904 12.1659 49.3956 11.7081C49.7751 11.2749 50.274 11.0629 50.9209 11.0629C51.5411 11.0629 52.042 11.2995 52.4514 11.7849C52.8731 12.2775 53.0685 12.8429 53.0685 13.5608C53.0685 14.2746 52.8721 14.8389 52.4493 15.3377C52.042 15.816 51.5422 16.0485 50.9199 16.0485C50.2729 16.0505 49.7731 15.8375 49.3925 15.4022ZM53.0675 4.78895V8.61518L52.5789 8.37552C51.969 8.07647 51.2727 7.9249 50.5116 7.9249C49.0428 7.9249 47.7983 8.45234 46.8119 9.49287C45.8019 10.557 45.2897 11.9252 45.2897 13.5628C45.2897 15.1492 45.7998 16.4981 46.8057 17.5744C47.8055 18.6539 49.0531 19.2008 50.5105 19.2008C51.5144 19.2008 52.3856 18.9673 53.1025 18.5064L53.3514 18.3477L53.5437 18.5709C53.8461 18.9222 54.3038 19.1076 54.8654 19.1076C55.9165 19.1076 56.5697 18.4398 56.5697 17.3655V4.78895C56.5697 3.71462 55.9011 3.04688 54.8242 3.04688C53.7412 3.04688 53.0675 3.71462 53.0675 4.78895Z" fill="white"></path></mask><g mask="url(#mask6_4203_105665)"><path d="M56.5697 3.04688H45.2897V19.1987H56.5697V3.04688Z" fill="url(#paint13_linear_4203_105665)"></path></g><path d="M2.18462 7.44243L2.07251 7.44448C0.922599 7.50286 0 8.45941 0 9.6208C0 10.8191 0.983283 11.8002 2.18462 11.8002H12.2777L12.3898 11.7971C13.5397 11.7387 14.4623 10.7812 14.4623 9.6208C14.4623 8.42254 13.48 7.44141 12.2777 7.44141H2.18462H12.2777H2.18462V7.44243Z" fill="url(#paint14_linear_4203_105665)"></path><mask id="mask7_4203_105665" maskUnits="userSpaceOnUse" x="0" y="7" width="15" height="5" style="mask-type: luminance;"><path d="M2.18462 7.44243L2.07251 7.44448C0.922599 7.50286 0 8.45941 0 9.6208C0 10.8191 0.983283 11.8002 2.18462 11.8002H12.2777L12.3898 11.7971C13.5397 11.7387 14.4623 10.7812 14.4623 9.6208C14.4623 8.42254 13.48 7.44141 12.2777 7.44141H2.18462H12.2777H2.18462V7.44243Z" fill="white"></path></mask><g mask="url(#mask7_4203_105665)"><path d="M14.4624 7.44263H0.00115967V11.8014H14.4624V7.44263Z" fill="url(#paint15_linear_4203_105665)"></path></g><path d="M59.7128 4.91591C59.7128 5.90421 60.3042 6.49412 61.2947 6.49412C62.2646 6.49412 62.8684 5.88885 62.8684 4.91591C62.8684 3.94194 62.2646 3.33667 61.2947 3.33667C60.3042 3.33769 59.7128 3.92761 59.7128 4.91591Z" fill="url(#paint16_linear_4203_105665)"></path><mask id="mask8_4203_105665" maskUnits="userSpaceOnUse" x="59" y="3" width="4" height="4" style="mask-type: luminance;"><path d="M59.7128 4.91591C59.7128 5.90421 60.3042 6.49412 61.2947 6.49412C62.2646 6.49412 62.8684 5.88885 62.8684 4.91591C62.8684 3.94194 62.2646 3.33667 61.2947 3.33667C60.3042 3.33769 59.7128 3.92761 59.7128 4.91591Z" fill="white"></path></mask><g mask="url(#mask8_4203_105665)"><path d="M62.8684 3.33789H59.7128V6.49534H62.8684V3.33789Z" fill="url(#paint17_linear_4203_105665)"></path></g><path d="M66.2348 4.91591C66.2348 5.90421 66.8262 6.49412 67.8167 6.49412C68.7876 6.49412 69.3904 5.88885 69.3904 4.91591C69.3904 3.94194 68.7876 3.33667 67.8167 3.33667C66.8272 3.33769 66.2348 3.92761 66.2348 4.91591Z" fill="url(#paint18_linear_4203_105665)"></path><mask id="mask9_4203_105665" maskUnits="userSpaceOnUse" x="66" y="3" width="4" height="4" style="mask-type: luminance;"><path d="M66.2348 4.91591C66.2348 5.90421 66.8262 6.49412 67.8167 6.49412C68.7876 6.49412 69.3904 5.88885 69.3904 4.91591C69.3904 3.94194 68.7876 3.33667 67.8167 3.33667C66.8272 3.33769 66.2348 3.92761 66.2348 4.91591Z" fill="white"></path></mask><g mask="url(#mask9_4203_105665)"><path d="M69.3904 3.33789H66.2348V6.49534H69.3904V3.33789Z" fill="url(#paint19_linear_4203_105665)"></path></g><path d="M2.18462 0L2.07251 0.00307232C0.9226 0.0614488 0 1.018 0 2.17939C0 3.37764 0.983283 4.35878 2.18462 4.35878H18.3028L18.415 4.35571C19.5649 4.29733 20.4875 3.34078 20.4875 2.17939C20.4875 0.981135 19.5052 0 18.3028 0H2.18462Z" fill="url(#paint20_linear_4203_105665)"></path><mask id="mask10_4203_105665" maskUnits="userSpaceOnUse" x="0" y="0" width="21" height="5" style="mask-type: luminance;"><path d="M2.18462 0L2.07251 0.00307232C0.9226 0.0614488 0 1.018 0 2.17939C0 3.37764 0.983283 4.35878 2.18462 4.35878H18.3028L18.415 4.35571C19.5649 4.29733 20.4875 3.34078 20.4875 2.17939C20.4875 0.981135 19.5052 0 18.3028 0H2.18462Z" fill="white"></path></mask><g mask="url(#mask10_4203_105665)"><path d="M20.4886 0H0.00115967V4.35775H20.4886V0Z" fill="url(#paint21_linear_4203_105665)"></path></g><path d="M21.3731 25.8014V27.8865H20.2458V22.2681H22.2998C22.6413 22.2681 22.9375 22.3111 23.1905 22.3951C23.4435 22.4801 23.6523 22.6009 23.8179 22.7576C23.9825 22.9143 24.1069 23.1007 24.1892 23.3188C24.2715 23.536 24.3137 23.7777 24.3137 24.0429C24.3137 24.303 24.2705 24.5407 24.1861 24.7547C24.1008 24.9698 23.9732 25.1551 23.8025 25.3118C23.6317 25.4685 23.4219 25.5894 23.171 25.6744C22.921 25.7594 22.6299 25.8014 22.2998 25.8014H21.3731ZM22.1805 24.9022C22.5487 24.9022 22.8048 24.8233 22.9519 24.6666C23.0979 24.5099 23.172 24.3 23.172 24.0388C23.172 23.7674 23.099 23.5534 22.9519 23.3987C22.8048 23.2441 22.5487 23.1673 22.1805 23.1673H21.3731V24.9022H22.1805Z" fill="black"></path><path d="M27.5824 23.4224C27.966 23.4224 28.29 23.5115 28.5533 23.6907C28.8166 23.8699 29.0017 24.1014 29.1087 24.3851V23.4777H30.236V27.8866H29.1087L29.1149 26.9639C29.0079 27.2558 28.8228 27.4923 28.5584 27.6726C28.2941 27.8528 27.9701 27.943 27.5854 27.943C27.3077 27.943 27.0485 27.8918 26.8089 27.7873C26.5682 27.6838 26.3605 27.5353 26.1846 27.3418C26.0087 27.1482 25.8709 26.9116 25.7721 26.6331C25.6734 26.3545 25.624 26.037 25.624 25.6816C25.624 25.3263 25.6734 25.0088 25.7721 24.7302C25.8709 24.4516 26.0077 24.2161 26.1835 24.0225C26.3594 23.8289 26.5672 23.6804 26.8068 23.577C27.0475 23.4736 27.3057 23.4224 27.5824 23.4224ZM27.9341 24.3933C27.5875 24.3933 27.3067 24.5049 27.0907 24.7292C26.8747 24.9524 26.7667 25.2689 26.7667 25.6796C26.7667 26.0841 26.8747 26.3975 27.0907 26.6218C27.3067 26.8451 27.5875 26.9567 27.9341 26.9567C28.1049 26.9567 28.2602 26.927 28.4021 26.8686C28.543 26.8103 28.6675 26.7252 28.7734 26.6136C28.8793 26.502 28.9627 26.3678 29.0213 26.2101C29.0799 26.0534 29.1087 25.8762 29.1087 25.6796C29.1087 25.4768 29.0789 25.2976 29.0213 25.1409C28.9627 24.9842 28.8804 24.85 28.7734 24.7374C28.6664 24.6247 28.543 24.5407 28.4021 24.4824C28.2612 24.4219 28.1049 24.3933 27.9341 24.3933Z" fill="black"></path><path d="M32.8094 23.4776L34.0159 26.4701L35.1349 23.4776H36.3733L33.6641 29.9871H32.4175L33.4162 27.7585L31.5546 23.4766H32.8094V23.4776Z" fill="black"></path><path d="M41.3607 27.0273H43.2553V27.8865H40.2344V22.2681H41.3617V27.0273H41.3607Z" fill="black"></path><path d="M46.4602 23.4224C46.8438 23.4224 47.1678 23.5115 47.4311 23.6907C47.6944 23.8699 47.8796 24.1014 47.9865 24.3851V23.4777H49.1138V27.8866H47.9865L47.9927 26.9639C47.8857 27.2558 47.7006 27.4923 47.4363 27.6726C47.1719 27.8528 46.8479 27.943 46.4633 27.943C46.1856 27.943 45.9264 27.8918 45.6867 27.7873C45.446 27.6838 45.2383 27.5353 45.0624 27.3418C44.8865 27.1482 44.7487 26.9116 44.6499 26.6331C44.5512 26.3545 44.5018 26.037 44.5018 25.6816C44.5018 25.3263 44.5512 25.0088 44.6499 24.7302C44.7487 24.4516 44.8855 24.2161 45.0614 24.0225C45.2372 23.8289 45.445 23.6804 45.6847 23.577C45.9243 23.4736 46.1825 23.4224 46.4602 23.4224ZM46.8119 24.3933C46.4653 24.3933 46.1845 24.5049 45.9685 24.7292C45.7525 24.9524 45.6445 25.2689 45.6445 25.6796C45.6445 26.0841 45.7525 26.3975 45.9685 26.6218C46.1845 26.8451 46.4653 26.9567 46.8119 26.9567C46.9827 26.9567 47.138 26.927 47.2799 26.8686C47.4208 26.8103 47.5453 26.7252 47.6512 26.6136C47.7572 26.502 47.8405 26.3678 47.8991 26.2101C47.9577 26.0534 47.9865 25.8762 47.9865 25.6796C47.9865 25.4768 47.9567 25.2976 47.8991 25.1409C47.8405 24.9842 47.7582 24.85 47.6512 24.7374C47.5442 24.6247 47.4208 24.5407 47.2799 24.4824C47.138 24.4219 46.9816 24.3933 46.8119 24.3933Z" fill="black"></path><path d="M53.2938 26.9157V27.8866H52.7024C52.473 27.8866 52.2642 27.86 52.075 27.8068C51.8857 27.7535 51.7232 27.6675 51.5874 27.5477C51.4517 27.4278 51.3478 27.2691 51.2758 27.0704C51.2038 26.8717 51.1678 26.6259 51.1678 26.334V24.424H50.5517V23.4767H51.1668V22.387H52.294V23.4767H53.2856V24.424H52.294V26.3433C52.294 26.5604 52.3372 26.7099 52.4226 26.7918C52.508 26.8738 52.652 26.9147 52.8536 26.9147H53.2938V26.9157Z" fill="black"></path><path d="M59.0557 25.5145C59.0557 25.5893 59.0515 25.6548 59.0433 25.7132C59.0351 25.7716 59.0258 25.833 59.0155 25.8965H55.7787C55.789 26.1085 55.824 26.2877 55.8826 26.4342C55.9412 26.5796 56.0184 26.6984 56.114 26.7885C56.2097 26.8787 56.3197 26.9432 56.4452 26.9831C56.5707 27.0231 56.6993 27.0425 56.832 27.0425C57.0973 27.0425 57.3154 26.978 57.4851 26.8479C57.6548 26.7179 57.7638 26.5468 57.8122 26.3348H59.0001C58.9569 26.5632 58.8767 26.7752 58.7564 26.9719C58.637 27.1685 58.4848 27.3375 58.3017 27.4809C58.1187 27.6243 57.9068 27.7369 57.6671 27.8188C57.4275 27.9008 57.1673 27.9428 56.8854 27.9428C56.5614 27.9428 56.2642 27.8916 55.9958 27.7871C55.7273 27.6837 55.4949 27.5352 55.2974 27.3416C55.0999 27.148 54.9477 26.9104 54.8386 26.6288C54.7296 26.3482 54.6751 26.0317 54.6751 25.6814C54.6751 25.3261 54.7296 25.0086 54.8386 24.73C54.9477 24.4514 55.1009 24.2159 55.2974 24.0223C55.4938 23.8288 55.7263 23.6803 55.9958 23.5768C56.2642 23.4734 56.5614 23.4211 56.8854 23.4211C57.2207 23.4211 57.5211 23.4734 57.7864 23.5768C58.0528 23.6803 58.2801 23.8257 58.4684 24.0141C58.6576 24.2026 58.8016 24.4238 58.9034 24.6788C59.0053 24.9338 59.0557 25.2124 59.0557 25.5145ZM57.9284 25.4039C57.9387 25.2134 57.915 25.0475 57.8564 24.9062C57.7978 24.7659 57.7206 24.6511 57.625 24.5641C57.5293 24.477 57.4172 24.4115 57.2897 24.3695C57.1621 24.3275 57.0284 24.306 56.8896 24.306C56.6016 24.306 56.3516 24.3951 56.1387 24.5723C55.9258 24.7505 55.8055 25.027 55.7787 25.4039H57.9284Z" fill="black"></path><path d="M61.7813 24.3215C61.9407 24.0511 62.1557 23.8319 62.4241 23.665C62.6936 23.498 63.0011 23.4141 63.3477 23.4141V24.6154H63.0207C62.8448 24.6154 62.6823 24.6338 62.5331 24.6707C62.384 24.7076 62.2534 24.77 62.1413 24.8581C62.0292 24.9452 61.9417 25.064 61.8769 25.2125C61.8132 25.361 61.7813 25.5443 61.7813 25.7614V27.8865H60.654V23.4776H61.7813V24.3215Z" fill="black"></path><defs><linearGradient id="paint0_linear_4203_105665" x1="3.69165" y1="18.7609" x2="3.69165" y2="4.58294" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint1_linear_4203_105665" x1="3.69175" y1="18.7609" x2="3.69175" y2="4.58294" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint2_linear_4203_105665" x1="23.5919" y1="18.7609" x2="23.5919" y2="4.58292" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint3_linear_4203_105665" x1="23.5917" y1="18.7609" x2="23.5917" y2="4.58292" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint4_linear_4203_105665" x1="37.0834" y1="18.7609" x2="37.0834" y2="4.58298" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint5_linear_4203_105665" x1="37.0835" y1="18.7609" x2="37.0835" y2="4.58298" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint6_linear_4203_105665" x1="61.2905" y1="18.7609" x2="61.2905" y2="4.58293" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint7_linear_4203_105665" x1="61.2904" y1="18.7607" x2="61.2904" y2="4.58274" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint8_linear_4203_105665" x1="67.813" y1="18.7609" x2="67.813" y2="4.58293" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint9_linear_4203_105665" x1="67.813" y1="18.7607" x2="67.813" y2="4.58274" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint10_linear_4203_105665" x1="77.7685" y1="18.7609" x2="77.7685" y2="4.58298" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint11_linear_4203_105665" x1="77.7687" y1="18.7609" x2="77.7687" y2="4.58298" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint12_linear_4203_105665" x1="50.9297" y1="18.761" x2="50.9297" y2="4.58301" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint13_linear_4203_105665" x1="50.9297" y1="18.761" x2="50.9297" y2="4.58301" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint14_linear_4203_105665" x1="7.2316" y1="18.7609" x2="7.2316" y2="4.58291" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint15_linear_4203_105665" x1="7.23171" y1="18.7611" x2="7.23171" y2="4.58311" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint16_linear_4203_105665" x1="61.2908" y1="18.7609" x2="61.2908" y2="4.58297" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint17_linear_4203_105665" x1="61.2908" y1="18.7611" x2="61.2908" y2="4.58316" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint18_linear_4203_105665" x1="67.8131" y1="18.7609" x2="67.8131" y2="4.58297" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint19_linear_4203_105665" x1="67.8131" y1="18.7611" x2="67.8131" y2="4.58316" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint20_linear_4203_105665" x1="10.2443" y1="18.7609" x2="10.2443" y2="4.58298" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient><linearGradient id="paint21_linear_4203_105665" x1="10.2444" y1="18.7609" x2="10.2444" y2="4.58297" gradientUnits="userSpaceOnUse"><stop offset="0.00175678" stop-color="#6D5FF0"></stop><stop offset="0.3942" stop-color="#3D93DF"></stop><stop offset="0.7958" stop-color="#11C3D0"></stop><stop offset="0.9959" stop-color="#00D6CA"></stop></linearGradient></defs></svg>'
    }
    innerClassBkBtn += "        </div>";
    innerClassBkBtn +=
        '            <p style="font-size: 12px;">(Sử dụng khi XÁC NHẬN KHOẢN VAY trên trang của Tổ chức Tài chính)</p>';
    innerClassBkBtn += "    </div>";
    innerClassBkBtn += '    <div class="bk-promotion-content">';
    innerClassBkBtn += "        <ul>";
    if (isHcvn) {
        innerClassBkBtn += createPromotionItem(
            "https://pc.baokim.vn/platform/img/home-paylater-ngang-small.svg",
            "Giảm 5% tối đa 80k cho đơn hàng từ 0 đồng. Áp dụng cho khách hàng mới",
            "SIÊU MỚI, SIÊU HOT"
        );
    }
    if (isKredivo) {
        innerClassBkBtn += createPromotionItem(
            // "https://pc.baokim.vn/platform/img/icon-kredivo.svg",
            // "Giảm 50% tối đa 100K, cho đơn hàng thành công đầu tiên."
            "",
            ""
        );
        innerClassBkBtn += createPromotionItem(
            // "https://pc.baokim.vn/platform/img/icon-kredivo.svg",
            // "Giảm 5% tối đa 200K cho đơn hàng thành công đầu tiên của gói kỳ hạn 6 hoặc 12 tháng."
            "",
            ""
        );
    }
    if (isMuadee) {
        innerClassBkBtn += createPromotionItem(
            // "https://pc.baokim.vn/platform/img/icon-muadee.svg",
            // "Giảm 50% tối đa 100K, cho đơn hàng thành công đầu tiên."
            "",
            ""
        );
        innerClassBkBtn += createPromotionItem(
            // "https://pc.baokim.vn/platform/img/icon-muadee.svg",
            // "Giảm 5% tối đa 200K cho đơn hàng thành công đầu tiên của gói kỳ hạn 6 hoặc 12 tháng."
            "",
            ""
        );
    }
    innerClassBkBtn += "        </ul>";
    innerClassBkBtn += '        <div class="bk-promotion-footer">';
    innerClassBkBtn += "            <p>Powered by</p>";
    innerClassBkBtn +=
        '            <img src="https://pc.baokim.vn/platform/img/bk-logo-promotion.svg" alt="">';
    innerClassBkBtn += "        </div>";
    innerClassBkBtn += "    </div>";
    innerClassBkBtn += "</div>";
    return innerClassBkBtn;
}

function configModal(currentElement) {
    switch (currentElement.className) {
        case "bk-btn-paynow":
            applyModalStyle(currentElement, 1, "bg_color_mdl_payment");
            break;
        case "bk-btn-installment":
            applyModalStyle(currentElement, 2, "bg_color_mdl_installment");
            break;
        case "bk-btn-installment-amigo":
            applyModalStyle(currentElement, 3, "bg_color_mdl_insta");
            break;
        default:
            console.warn("Không có kiểu nút phù hợp.");
    }
}

function applyModalStyle(currentElement, typeKey, bgColorKey) {
    var mdlHeader = document.getElementById("bk-modal-pop");
    stylePopup.forEach((style) => {
        if (style.type === typeKey && style.status === 1) {
            const color = style[bgColorKey] || bgHeaderDefault;
            mdlHeader.style.backgroundColor = color;

            if (style.display_mode_popup === 2) {
                Object.assign(mdlHeaderStyle.style, {
                    width: "100%",
                    margin: "0px",
                    height: "100%",
                });
            }
        }
    });
}

function removeInstallmentButton() {
    const installmentBtn = document.querySelector(".bk-btn-installment");
    if (installmentBtn) {
        installmentBtn.remove();
    }
}

function getPrice(oldPrice) {
    price = oldPrice.replace("VNĐ", "");
    price = oldPrice.split(".").join("");
    price = price.split(",").join("");
    price = price.split(" ").join("");
    price = oldPrice.replace(/[^0-9]/g, "");
    price = parseInt(price, 10);
    return price;
}

function genUrlEmbedCore(uri) {
    return `${startPointEmbedCore}/${uri}`;
}

function styleBody() {
    var body = document.getElementsByTagName("body")[0];
    var oldWidth = body.offsetWidth;
    body.style.overflow = "hidden";
    body.style.width = oldWidth;
}

function callXhrApi(url, data, method = "POST", async = false) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, async); // false để gọi đồng bộ
    // xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(data);

    if (xhr.status >= 200 && xhr.status < 300) {
        return JSON.parse(xhr.responseText);
    } else {
        console.error("API call failed with status:", xhr.status);
        return null;
    }
}

import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
    const colors = {
        visa: ["#436D99", "#2D57F2"],
        mastercard: ["#DF6F29", "#C69347"],
        discover: ["#F3AE07" , "#F2FFF0"],
        diners: ["#F2FFF0","#12100F"],
        jcb: ["#0885FF", "#E5100F", "#07E823"],
        default: ["black", "gray"],
    }
    
    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])
    ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType


const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
    mask: "0000"
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        YY: {
            mask: IMask.MaskedRange, 
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12,
        },
    },
}

const expirationDateMasked = IMask (expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPatter = {
    mask: [
        {
            mask: '0000 0000 0000 0000',
            regex: /^4\d{0,15}/,
            cardtype: 'visa'
        },

        {
            mask: "0000 0000 0000 0000",
            regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard",
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
            cardtype: 'discover'
        },
        {
            mask: '0000 000000 0000',
            regex: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
            cardtype: 'diners'
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /^(?:35\d{0,2})\d{0,12}/,
            cardtype: 'jcb'
        },
    ],
    dispatch: function(appended, dynamicMasked){
        const number = (dynamicMasked.value + appended).replace(/\D/g,"")
        const foundMask = dynamicMasked.compiledMasks.find(function(item){
            return number.match(item.regex)
        })

        console.log(foundMask)

        return foundMask
    },
}
const cardNumberMasked = IMask (cardNumber, cardNumberPatter)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click" , () => {
    alert("Cartão adicionado com sucesso!")
    
})

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input" , () => {
    const ccHolder = document.querySelector(".cc-holder .value")

    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

securityCodeMasked.on("accept" , () => {
    updateSecurityCode(securityCodeMasked.value);
})

function updateSecurityCode (code) {
    const ccSecutiry = document.querySelector(".cc-security .value")
    
    ccSecutiry.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept" , () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
    const ccNumber = document.querySelector(".cc-number")
    
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on ("accept" , () => {
    updateExpirationDate(expirationDateMasked.value)

})

function updateExpirationDate(date) {
    const ccExpiration = document.querySelector(".cc-extra .value")
    ccExpiration.innerText = date.length === 0 ? "02/32" : date
}


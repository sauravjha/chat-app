const socket = io()

const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

socket.on("message", (message) => {
    console.log(message)
})

$messageForm.addEventListener('submit', (e)=> {
    e.preventDefault()
    //$messageFormButton.setAttribute('disabled', 'disabled')
    $messageFormButton.disabled = true
    const message = e.target.elements.message.value
    socket.emit("messageSent", message, (error)=> {
        $messageFormButton.disabled = false
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error) {
            return console.log(error)
        }
        console.log('Message Delivered')
    })
})

const $buttonSendLocation = document.querySelector("#send-location")
$buttonSendLocation.addEventListener('click', ()=> {
    if(!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser")
    }
    $buttonSendLocation.disabled = true
    navigator.geolocation.getCurrentPosition((position) => {
        const location = { latitude: position.coords.latitude, longitude: position.coords.longitude }
        socket.emit('sendLocation', location, (acknowledged)=> {
            $buttonSendLocation.disabled = false
            console.log(acknowledged)
        })
    })
})
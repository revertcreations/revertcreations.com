const myName = document.getElementById('name')
const textColors = ['text-revert-black', 'text-revert-yellow', 'text-revert-blue', 'text-revert-green']

myName.onmouseover = playNameAnimation

playNameAnimation()

function playNameAnimation() {
    // loop through each letter in the <span> children in the name element
    for (let i = 0; i < myName.children.length; i++) {
        const letter = myName.children[i];
        // first remove all text colors
        letter.classList.remove(...textColors)
        // add random color class to each letter
        letter.classList.add(textColors[Math.floor(Math.random() * textColors.length)])
        letter.style.animationDelay = `${i * 0.1}s`
    }
}


function disiplineTargeted(e) {
    let title = e.target
    // console.log('e.target', e.target)
    // window.title = e.target
    let target_disipline = e.target.innerText.toLowerCase()
    console.log('target_disipline', target_disipline)
}

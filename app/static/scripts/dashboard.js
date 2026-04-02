function toggleDropdown() {
    const menu = document.getElementById("my-account-dropdown")
    menu.classList.toggle("hidden")
}

document.addEventListener("click", (e) => {
    const wrapper = document.getElementById("my-account-wrapper")
    if (wrapper && !wrapper.contains(e.target)) {
        document.getElementById("my-account-dropdown").classList.add("hidden")
    }
})

const loadData = async () => {
  const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
  const data = await response.json()
  displayList(data.data)
}

const statusBadge = (labels) => {
  const [temp1, temp2, temp3] = [...labels];

  const badges =
    [
      `<span class="text-xs font-medium text-[#ef4444FF] bg-[#feececFF] p-2 rounded-[100px] border border-[#ef4444FF]"><i class="fa-solid fa-bug"></i> ${temp1}</span>`,
      `<span class="text-xs font-medium text-[#d97706FF] border-[#fde68aFF] p-2 rounded-[100px] border bg-[#fff8dbFF]">
              <i class="fa-regular fa-life-ring"></i> ${temp2}</span>`,
      `<span class="text-xs font-medium text-[#64748bFF] border-[#64748bFF] p-2 rounded-[100px] border bg-[#eeeff2FF]"><iclass="fa-regular fa-life-ring"></i> ${temp3}</span>`
    ]
  let html = ""
  badges.forEach(element => {
    if (!element.includes("undefined"))
      html += element
  });

  return html;
}

const displayList = (data) => {
  const list = document.getElementById("list-section");
  list.innerHTML = ""
  data.forEach(element => {
    list.innerHTML += `        
    <div id ="${element.id}" class="card  border-t-2 border-[${element.status === 'open' ? '#00a96eFF' : '#a855f7FF'}] w-full bg-base-100 card-xs shadow-sm ">
          <div class="card-body p-4">
            <!-- card status -->
            <div class="flex justify-between items-center mb-2">
              <div> <img src="./assets/${element.status === 'open' ? 'Open' : 'Closed'}-Status.png" alt=""></div>
              <div>
                ${element.priority === "high" ? '                <span class="text-xs font-medium text-[#ef4444FF] bg-[#feececFF] px-5 py-2 rounded-[100px]">HIGH</span>' :
        element.priority === "medium" ?
          '<span class="text-xs font-medium text-[#f59e0bFF] bg-[#fff6d1FF] px-5 py-2 rounded-[100px]">MEDIUM</span>' :
          '<span class="text-xs font-medium text-[#9ca3afFF] bg-[#eeeff2FF] px-5 py-2 rounded-[100px]">LOW</span>'
      }
            </div>
            </div>
            <!-- issues content -->
            <div class="content mb-3">
              <h2 class="text-sm font-semibold mb-2">${element.title}</h2>
              <p class="text-xs text-[#64748bFF]">${element.description}</p>
            </div>
            <!-- badges -->
            <div class="badges flex flex-wrap gap-2 mb-4">
            ${statusBadge(element.labels)
      }

            </div>
            <!-- issued by -->
            <div class="">
              <p class="text-[#64748bFF] text-xs">#${element.id} ${element.author}</p>
              <p class="text-[#64748bFF] text-xs"> ${new Date(element.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>`
  });
  manageAnimation(false)
}

loadData()
// all, open, close
document.getElementById("buttons").addEventListener("click", async (event) => {
  manageAnimation(true)
  const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
  const data = await response.json()
  const issueData = data.data

  const btns = document.getElementsByClassName("btns")
  const count = document.getElementById("issue-count-id")

  if (event.target.tagName === "BUTTON") {
    for (let btn of btns) {
      btn.classList.remove("btn-primary")
      btn.classList.add("text-[#64748bFF]")
    }
    event.target.classList.add("btn-primary")
    event.target.classList.remove("text-[#64748bFF]")
  }


  if (event.target.innerHTML === "Open") {
    const result = issueData.filter(element => element.status === "open")
    count.innerHTML = result.length;
    displayList(result)
  }
  if (event.target.innerHTML === "Close") {
    const result = issueData.filter(element => element.status === "closed")
    count.innerHTML = result.length;
    displayList(result)
  }
  if (event.target.innerHTML === "All") {
    count.innerHTML = issueData.length;
    displayList(issueData)
  }
  
})


const loadDetails = async (id) => {
  const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
  const data = await response.json();

  const details = data.data
  displayDetails(details)

}
const displayDetails = (details) => {
  const modal = document.getElementById("details")
  modal.innerHTML = `
    <h2 class="text-2xl font-bold">${details.title}</h2>

      <div class="flex gap-2">

        <div class="px-4 py-2 font-medium rounded-xl text-xs text-[#ffffffFF] bg-[${details.status === 'open' ? '#00a96eFF' : '#a855f7FF'}]">${details.status}</div>

        <div class="flex gap-2 items-center">
          <div class="w-2 h-2 rounded-full bg-[#64748bFF]"></div>
          <h2 class="text-xs ">Opened by ${details.author}</h2>
          <div class="w-2 h-2 rounded-full bg-[#64748bFF]"></div>
          <h2 class="text-xs ">${new Date(details.createdAt).toLocaleDateString()}</h2>
        </div>

      </div>

      <div class="flex flex-wrap gap-2">
        ${statusBadge(details.labels)}
      </div>
      <div>
        <p class="text-[#64748bFF] font">${details.description}</p>
      </div>

      <div class="p-4 bg-[#f8fafcFF] grid grid-cols-2">
        <div>
          <h2 class="text-[#64748bFF]">Assignee:</h2>
          <h2 class="font-semibold text-[#1f2937FF]">${details.author}</h2>
        </div>
        <div class= "flex flex-col items-start">
          <h2 class="text-[#64748bFF] mb-2">Priority:</h2>
          ${details.priority === "high" ? '<span class=" text-xs font-medium text-[#ef4444FF] bg-[#feececFF] px-6 py-2 rounded-[100px]">HIGH</span>' : details.priority === "medium" ?
      '<span class="text-xs font-medium text-[#f59e0bFF] bg-[#fff6d1FF] px-6 py-2 rounded-[100px]">MEDIUM</span>' :
      '<span class="text-xs font-medium text-[#9ca3afFF] bg-[#eeeff2FF] px-6 py-2 rounded-[100px]">LOW</span>'
    }
        </div>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn btn-primary">Close</button>
        </form>
      </div>
    
  `;
  document.getElementById("my_modal_1").showModal();
}

document.getElementById("list-section").addEventListener("click", (event) => {
  const card = event.target.closest(".card")
  if (card) {
    loadDetails(card.id)
  }
})


document.getElementById("search-btn").addEventListener("click", async () => {
  const value = document.getElementById("search-id").value.trim().toLowerCase()
  const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${value}`)
  const data = await response.json()
  displayList(data.data)
  document.getElementById("issue-count-id").innerText = data.data.length
})
const manageAnimation = (status) => {
  if (status) {
    document.getElementById("loading-animation").classList.remove("hidden")
    document.getElementById("list-section").classList.add("hidden")
  } else {
    document.getElementById("loading-animation").classList.add("hidden")
    document.getElementById("list-section").classList.remove("hidden")
  }

}
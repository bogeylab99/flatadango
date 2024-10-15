document.addEventListener("DOMContentLoaded", (e) => {
    function movielist() {
        fetch("http://localhost:3000/films")
            .then((response) => response.json())
            .then((data) => {
                const ul = document.getElementById("films");
                data.forEach((movie) => {
                    let soldOut = Math.abs(movie.capacity - movie.tickets_sold);
                    const movielists = document.createElement("li");
                    movielists.innerHTML = `<li class="film item">${movie.title}</li>`;
                    if (soldOut < 1) {
                        movielists.classList.add("sold-out");
                        movielists.append();
                    }
                    
                    function deleteMovie() {
                        let deleteButton = document.createElement("button");
                        deleteButton.innerText = "Delete";
                        deleteButton.addEventListener("click", (event) => {
                            event.preventDefault();
                            let movieId = movie.id;
                            fetch(`http://localhost:3000/films/${movieId}`, {
                                method: "DELETE",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    console.log(data);
                                    movielists.remove();
                                });
                        });
                        movielists.appendChild(deleteButton);
                    }

                    deleteMovie();
                    ul.appendChild(movielists);
                });
            })
            .catch((error) => {
                console.error("Error fetching movie data:", error);
            });
    }
    // first movie
    function imgPoster() {
        fetch("http://localhost:3000/films/1")
            .then((response) => response.json())
            .then((data) => {
                const imageHolder = document.getElementById("poster");
                imageHolder.src = data.poster;
                imageHolder.alt = data.title;
                imageHolder.append();
            });
    }
    function movieDetails() {
        fetch("http://localhost:3000/films/8")
            .then((response) => response.json())
            .then((data) => {
                const title = document.getElementById("title");
                const runtime = document.getElementById("runtime");
                const filmInfo = document.getElementById("film-info");
                const showtime = document.getElementById("showtime");
                const ticketNum = document.getElementById("ticket-num");
                title.innerText = data.title;
                runtime.innerText = data.runtime;
                filmInfo.innerText = data.description;
                showtime.innerText = data.showtime;
                ticketNum.innerText = Math.abs(data.capacity - data.tickets_sold);
                //Tickets

                let remaining = ticketNum.innerText;
                const buybtn = document.getElementById("buy-ticket");
                if (remaining < 1) {
                    buybtn.innerText = "Sold Out";
                    buybtn.append();
                }

                buybtn.onclick = (e) => {
                    e.preventDefault();
                    if (remaining > 0) {
                        let sold_data = Math.abs(data.tickets_sold + 1);
                        let patchData = {
                            tickets_sold: sold_data,
                        };

                        //PATCH 
                        fetch("http://localhost:3000/films/8", {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(patchData),
                        })
                            .then((response) => response.json())
                            .then(data => {
                                console.log("Success");
                                remaining--;
                                ticketNum.innerText = remaining;


                                //POST 
                                function postTicket(filmId, numberOfTickets) {
                                    const postData = {
                                        film_id: filmId,
                                        number_of_tickets: numberOfTickets
                                    };

                                    //POST 
                                    fetch("http://localhost:3000/tickets", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(postData)
                                    })
                                        .then(response => response.json())
                                        .then(ticketData => {
                                            console.log("Ticket created successfully:", ticketData);
                                        })
                                }
                                postTicket(data.id, Math.abs(data.capacity - sold_data));

                            });
                    } else {
                        buybtn.innerText = "Sold Out";

                    }
                };


                title.append();
                runtime.append();
                filmInfo.append();
                showtime.append();
                ticketNum.append();
            });
    }

    // function callback
    movieDetails();
    imgPoster();
    movielist();
});
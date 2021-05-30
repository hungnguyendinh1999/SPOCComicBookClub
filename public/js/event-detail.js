let event = {
    "event_name": "Wellness Day Werewolf",
    "date": "Thursday, May 20 2021",
    "time_from": "4:00 PM EST",
    "time_to": "5:00 PM EST",
    "location": "Lurie Conference Room, UC",
    "description": "Come join us in the Lurie conference room at 4pm on wellness day for some ultimate werewolf! Werewolf is a hidden roles game so it will test your deduction and deception. Make sure to bring your friends!",
    "img_url": "https://images.collegiatelink.net/clink/images/637db21f-bd59-4161-8e1e-e5468ba3fcf35589ae06-3bce-4df6-9bd0-dc20d0b5ed93.png?preset=med-w",
    "categories": ["Game","RPG"]
}

$('#more_info_button').on('click', function() {
    location.href="https://clarku.campuslabs.com/engage/organization/sciencefictionpeopleofclark"
})

function load_car(event) {
    $('.image-header').attr('src', event.img_url);
    $('#title').text(event.event_name);
    $('#date').text(event.date);
    $('#time').text(`From ${event.time_from} to ${event.time_to}`);
    $('#location').text(event.location);
    $('#description').text(event.description);

    const list = event.categories;
    let output = "";
    for (let cat of list) {
        output += `<span class="category-tag">${cat}</span>`
    }

    $('#categories').empty().append(output);
}

$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const event_id = urlParams.get('id');

    if (event_id) {
        console.log(event_id)
        $.getJSON('/get_event_by_id?event_id=' + event_id)
            .done(function (data) {
                if (data["message"] === "success") {
                    event = data["data"];
                    load_car(event);
                }
            });
    }
});

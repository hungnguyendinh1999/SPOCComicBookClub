function showList(rsvps) {
    $('#rsvp_list').empty();

    for (let i = 0; i < rsvps.length; i++) {
        $('#rsvp_list').append("<li class='list-group-item'></li>");
    }

    $('#rsvp_list li')
        .attr("value", function (idx) {
            return rsvps[idx]._id;
        })
        .append("<div class='row'></div>");

    $('#rsvp_list .row').addClass(function (idx) {
        if (idx % 2 === 0) {
            return 'even_row';
        } else {
            return 'odd_row';
        }
    });

    $('#rsvp_list .row')
        .append("<div class='col-lg-6 imgDiv'></div>")
        .append("<div class='col-lg-6 infoDiv'></div>");

    $('.imgDiv').append("<img class='avatar_rsvp'/>");
    $('.avatar_rsvp').attr('src', function (idx) {
        if (rsvps[idx].avatar)
            return rsvps[idx].avatar;
        else
            return "https://cdn.vox-cdn.com/thumbor/X7fW7KYz0XEz57TAGoUcDU2YpbA=/0x0:696x534/1200x800/filters:focal(293x212:403x322)/cdn.vox-cdn.com/uploads/chorus_image/image/69312307/Untitled.0.jpg";
    });

    $('.infoDiv')
        .append(function (idx) {
            return `<h4 class="rsvp_name">${rsvps[idx].name}</h4>`;
        })
        .append(idx => {
            return `<p class="email">Email: ${rsvps[idx].email}</p>`;
        })
        .append(idx => {
            return `<p class="head_count">Number of people coming: ${rsvps[idx].head_count}</p>`;
        })
        .append(idx => {
            return `<p class="message">Message: ${rsvps[idx].message}</p>`;
        });

}

$.getJSON("/get_all_rsvps")
    .done(function (data) {
        if (data.message === "success") {
            showList(data.data);
        }
    });
// data = [{_id: 123, name: "Doe", email: "doe@john.com", head_count:5, message:"abc"}];
// showList(data);

function onCreate() {
    location.href = "/edit";
}

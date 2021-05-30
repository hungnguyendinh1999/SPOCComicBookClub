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
        .append("<div class='col-lg-6 infoDiv'></div>")

    $('.infoDiv')
        .append(function (idx) {
            return `<a class="rsvp_name">${rsvps[idx].name}</a>`;
        })
        .append(idx => {
            return `<p class="email">Email: ${rsvps[idx].email}</p>`;
        })
        .append(idx => {
            return `<p class="head_count">Number of people coming: ${rsvps[idx].head_count}</p>`;
        });


    $('.rsvp_name').on('click', function () {
        const rsvpId = $(this).parents("li").attr('value');
        location.href = "rsvp_detail.html?rsvp_id=" + rsvpId;
    });
}

// $.getJSON("/get_all_rsvps")
//     .done(function (data) {
//         if (data.message === "success") {
//             showList(data.data);
//         }
//     });
data = [{_id: 123, name: "Doe", email: "doe@john.com", head_count:5, message:"abc"}];
showList(data);

function onCreate() {
    location.href = "/edit";
}

$(document).ready(function () {
   $.getJSON('/get_current_user').done(function (data) {
       console.log(data)
       if (data['message'] === 'success') {
           $('.login').remove();
           $('#showname').text(data.data.fullname);
       } else {
           $('.logout').remove();
       }
   })
});
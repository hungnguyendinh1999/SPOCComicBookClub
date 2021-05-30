function load_rsvp(rsvp) {
    $('#name').text(rsvp.title);
    $('#rating').text(rsvp.rating);
    $('#release_date').text(rsvp.release_date);
    $('#overview').text(rsvp.overview);
    $('#poster_img').attr('src', rsvp.poster_path);

    if (rsvp.likes){
        const names = [];
        rsvp.likes.forEach((user) => {
            names.push(user.fullname);
        });
        $('#user_list').text(names.join(', '));
    }
}

const urlParams = new URLSearchParams(window.location.search);
const rsvp_id = urlParams.get('rsvp_id')
console.log(rsvp_id);

$(document).ready(function () {
    if (rsvp_id) {
        $.getJSON('/get_rsvp_by_id?rsvp_id=' + rsvp_id)
            .done(function (data) {
                if (data['message'] === "success") {
                    rsvp = data["data"];
                    load_rsvp(rsvp);
                }
            });
    }
});

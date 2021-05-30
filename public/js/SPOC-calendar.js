function showList(data) {
    // console.log(data[0]);

    $('#event_grid').empty();

    /** 1. Event List **/
    for (let i = 0; i <data.length; i++){
        $('#event_grid').append('<div class="col-lg-3 col-md-4 col-sm-6 col-10"><a></a></div>');
    }

    /** 2. Event Cards **/
    $('#event_grid a').append("<div class=\"card\"></div>")
        .attr('href', (index) => {
            return `/event-detail?id=${data[index]._id}`;
        });
    $('.card')
        .append("<img class=\"card-img-top\"/>")
        .append("<div class=\"card-body row\"></div>")
        .append("<div class=\"card-footer\"></div>");

    $('.card-img-top').attr('src', (index) => {
        return data[index].img_url;
    });

    /** 3. Car information **/
    $('.card-body')
        .append("<h5 class=\"card-title\"></h5>")
        .append("<div class='info-container'></div>")

    $('.card-title')
        .append(index => {
            return `${data[index].event_name}`
        })

    $('.info-container')
        .append(index => {
            return `<p><i class="far fa-calendar"></i> ${data[index].date} at ${data[index].time_from}</p>`
        })
        .append(index => {
            return `<p><i class="fas fa-map-marker-alt"></i> ${data[index].location}</p>`
        })

    $('.card-footer')
        .append(index => {
            const list = data[index].categories;
            let output = "";
            for (let cat of list) {
                output += `<span class="category-tag">${cat}</span>`
            }
            return output;
        })



}

$.getJSON('/get_all_SPOC_events').done(function(data) {
    if (data["message"] === "success") {
        showList(data["data"]);
    }
})
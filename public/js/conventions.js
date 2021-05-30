function showList(conventions) {
    $('.list-group').empty();
    for(convention of conventions) {
        $('.list-group').append(
            `<li class="list-group-item">
                <div class="row">
                    <div class="col">
                        <a href=${convention.url}><h2>${convention.event_name}</h2></a>
                        <p>${convention.description}</p>
                    </div>
                    <div class="col">
                        <p>
                            ${new Date(convention.start).toLocaleDateString()}<br/>
                            -<br/>
                            ${new Date(convention.end).toLocaleDateString()}
                        </p>
                    </div>
                    <div class="col">
                        <p>${convention.location}</p>
                    </div>
                </div>
            </li>`);
    }
    $(".list-group-item").addClass(function (idx) {
        if(idx % 2===0) {
            return "even_row";
        } else {
            return "odd_row";
        }
    });
}

let list=[];

let increasing = true

$.getJSON("/node_get_all_conventions")
    .done(function (data) {
        if (data.message === "success") {
            list = data["data"];
            showList(list);
        }
    });

$('#dates').on('click', function () {
    increasing=!increasing
    if (increasing){
        list.sort((a,b)=>{return new Date(a.start)-new Date(b.start)});
        $('.date-sort').removeClass('fa-sort-up').addClass('fa-sort-down');
    } else {
        list.sort((a,b)=>{return new Date(b.start)-new Date(a.start)});
        $('.date-sort').removeClass('fa-sort-down').addClass('fa-sort-up');
    }
    showList(list);
});

function search() {
    console.log("filtering by search:")
    $.get('/get_cons_by_filters', {
        search_key: $('#search_box').val()
    }).done((data) => {
        if (data.message === "success") {
            list = data["data"];
            showList(list);
        }
    });
}
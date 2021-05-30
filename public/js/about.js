$.getJSON("/node_get_all_members")
    .done(function (data) {
        if (data.message === "success") {
            members = data["data"];
            for(member of members) {
                $('.list-group').append(
                    `<li class="list-group-item">
                        <div class="profile">
                            <div class="profile_img_div">
                                <img class="profile_img" src=${member.image_path} alt=${member.fullname}/>
                            </div>
                            <div class="profile_content">
                                <h1>${member.fullname}</h1>
                                <p>${member.roles}<br/>Pronouns: ${member.pronouns}<br/>${member.description}</p>
                            </div>
                        </div>
                    </li>`);
            }
        }
    });
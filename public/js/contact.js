members = [{
    "fullname": "Griffin Ford",
    "image_path": "img/Griffin_Ford.jpg",
    "roles": "SPOC Treasurer",
    "email": "gford@clarku.edu",
    "pronouns": "She/Her",
    "description": "Griffin Ford is an X-Men fan who helps the club keep up to date on Marvel Comics runs. If she's not complaining about the MCU you can find her gushing over Eye-Boy or Glob."
}]
for(member of members) {
    $('.list-group').append(
        `<li class="list-group-item">
                        <div class="profile">
                            <div class="profile_img_div">
                                <img class="profile_img" src=${member.image_path} alt=${member.fullname}/>
                            </div>
                            <div class="profile_content">
                                <h1>${member.fullname}</h1>
                                <p>${member.roles}<br/>Pronouns: ${member.pronouns}<br/>Email: ${member.email}<br/>${member.description}</p>
                            </div>
                        </div>
                    </li>`);
}
$('select').selectpicker();
$('form').on('submit', function () {
    let errorMessage = null
    $.each($('input,textarea'), function () {
        console.log($(this).val());
        let parentLabel = $(this).parent().find('label').text();
        if (!$(this).val()) {
            if (parentLabel !== 'Avatar url (Optional)'){
                errorMessage = `${parentLabel} cannot be empty`;
                return false;
            }
        }
    });
    if (errorMessage !== null) {
        $('#error_message').text(errorMessage);
        return false;
    }
});

function onCancel() {
    location.href = "/weekly_meeting";

}
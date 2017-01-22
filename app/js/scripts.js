

var fbScripts = {
    login: function (user, pass) {
        var emailElem = document.getElementById("email");
        emailElem.setAttribute("value", config.fbCredentials.user);
        var passwordElem = document.getElementById("pass");
        passwordElem.setAttribute("value", config.fbCredentials.pass);
        var form = document.getElementById("login_form");
        form.submit();
    },
    getNotifications: function () {
        var aTag = document.getElementsByClassName("jewelButton")[2]; aTag.click();
        var ntfs = [];
        window.setTimeout(() => {
            var notificationsLayout = document.getElementById("fbNotificationsFlyout");
            var notificationsPanel = notificationsLayout.getElementsByTagName("ul")[0];
            var liList = Array.from(notificationsPanel.getElementsByTagName("li"))
            // .filter(li => li.getAttribute("class").indexOf("jewelItemNew") != -1 ); 
            var infoList = liList.map((li) => li.getElementsByTagName("span"));
            ntfs = infoList.map(span => span.item(1).textContent + " " + span.item(span.item(1).childNodes.length + 2).textContent);
        }, 300);

    },
    getMessages: function () {
        var aTag = document.getElementsByClassName("jewelButton")[1]; aTag.click();
        var mgs = [];
        window.setTimeout(() => {
            var content = document.getElementsByClassName("jewelContent")[0];
            var liArray = Array.from(content.getElementsByTagName("li"))
            // .filter(li => li.getAttribute("class").indexOf("jewelItemNew") != -1 );

            mgs = liArray.map(li => { var liContent = li.getElementsByClassName("content")[0]; return { from: liContent.childNodes[0].textContent, message: liContent.childNodes[1].textContent, time: liContent.childNodes[2].textContent } });
        }, 300)
    }, getFriendsR: function () {
        var aTag = document.getElementsByClassName("jewelButton")[0]; aTag.click();
        var frInfo = [];
        window.setTimeout(() => {
            var requestList = Array.from(document.getElementsByClassName("fbRequestList")[0].getElementsByTagName("li"))
            // .filter(li => li.getAttribute("class").indexOf("jewelItemNew") != -1 );

            frInfo = requestList.map(li => { var t = li.textContent.split(" "); var buttons = li.getElementsByTagName("button"); var mutual = t[t.length - 3]; if (!Number.isInteger(mutual)) mutual = 0; return { from: t[0] + " " + t[1], accept: buttons[0], declined: buttons[1], mutual } }).filter(({accept}) => accept);
        }, 3000);
    },
    getNewsFeed: function () {
        var content = Array.from(document.getElementsByClassName("userContentWrapper")).filter(elem => {
            var e = elem.getElementsByClassName("userContent");
            var b = e[0].nextSibling; return b.getElementsByTagName("img").length == 0 && b.getElementsByTagName("video").length == 0
        });
        var _content = content.map(c => { var userc = c.getElementsByClassName("userContent")[0]; var pb = userc.previousSibling.getElementsByTagName("a"); console.log(pb); var sharedFrom = pb[1], sharedTo = pb[2], sharedStamp = pb[pb.length - 1]; return { text: userc.textContent, sharedFrom: sharedFrom && sharedFrom.textContent, sharedTo: sharedTo && sharedTo.textContent, sharedStamp: sharedStamp && sharedStamp.textContent } });
    }


}


module.exports = fbScripts
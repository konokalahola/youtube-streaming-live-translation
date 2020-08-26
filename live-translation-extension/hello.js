var idList;

const observer4 = new MutationObserver(function (mutations, me) {
    let tempFrameNode = document.getElementById("chatframe").contentWindow.document.getElementById("item-offset");
    if (tempFrameNode != null && tempFrameNode.children.length > 0) {
        for (let i = 0; i < tempFrameNode.children[0].children.length; i++) {
            let childNode = tempFrameNode.children[0].children[i];
            if (!idList.includes(childNode.id)) {
                idList.push(childNode.id);
                if (childNode.children.length > 1) {
                    let childDescent = childNode.children[1];
                    if (childDescent.children[2] != null && (childDescent.children[2].innerText.toLowerCase().startsWith("[en]") || childDescent.children[2].innerText.toLowerCase().startsWith("[eng]"))) {
                        let containerTemp = document.getElementById("translate_container");
						const position = document.getElementById("translate_container").scrollHeight - document.getElementById("translate_container").offsetHeight - 5;
						
						containerTemp.insertAdjacentHTML('beforeend', '<div style="margin-top: 15px;"><b>' + childDescent.children[1].innerText + ':</b>&nbsp;&nbsp;' + childDescent.children[2].innerText + '</div>');
						
                        if (containerTemp.scrollTop >= position) {
                            containerTemp.scrollTo(0, containerTemp.scrollHeight);
                        }
                    }
                }
            }
        }

		if (document.getElementById("translate_live_button").style.display == "none") {
			document.getElementById("upnext").style.display = "flex";
			document.getElementById("translate_live_button").style.display = "block";
		}
						
        if (idList.length > 2000) {
            const idListCount = idList.length - 2000;
            for (let k = 0; k < idListCount; k++) {
                idList.shift();
            }
        }
    }
});

// set up the mutation observer
const observer3 = new MutationObserver(function (mutations, me) {
    var upnext = document.getElementById("upnext");
    if (upnext.innerText !== "" && document.getElementsByClassName("ytp-live").length > 0) {
        me.disconnect();
        upnext.insertAdjacentHTML('beforeend', '<svg id="translate_live_button" viewBox="0 0 20 20" width="20" height="20" class="adjustments w-6 h-6" style="vertical-align: middle; margin-left: 7px;"><path fill-rule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clip-rule="evenodd"></path></svg>');
        document.getElementById("translate_live_button").style.fill = "gray";
        document.getElementById("translate_live_button").style.display = "none";
        document.getElementById("translate_live_button").onclick = function() {
            if (document.getElementById("translate_live_button").style.fill === "gray") {
                let divTemp = document.getElementById("translate_container");
                document.getElementById("translate_live_button").style.fill = "#c00";
                document.getElementById("info-contents").style.display = "none";
                divTemp.style.display = "block";
                divTemp.scrollTo(0, divTemp.scrollHeight);
            }
            else {
                document.getElementById("translate_live_button").style.fill = "gray";
                document.getElementById("info-contents").style.display = "block";
                document.getElementById("translate_container").style.display = "none";
            }
        };

        document.getElementById("info-contents").insertAdjacentHTML('afterend', '<div id="translate_container" style="display: none; font-size: 13px; width: 100%; height: 120px; background-color: white; overflow: hidden; overflow-y: scroll; padding-bottom: 15px; margin-top: 5px; padding-left: 10px; padding-right: 10px;"></div>');
        setTimeout(function() {
            idList = [];
            observer4.observe(document.getElementById("chatframe").contentWindow.document, {
                childList: true,
                subtree: true
            });
        }, 500);

        console.log("Is live");
        return;
    }
});

const observer2 = new MutationObserver(function (mutations, me) {
    console.log("video: " + document.body.getElementsByTagName("ytd-watch-flexy")[0].getAttribute("video-id"));
    observer4.disconnect();
    observer3.disconnect();

    idList = [];
    let temp = document.getElementById("translate_live_button");
    if (temp)
    {
        temp.remove();
    }

    let temp1 = document.getElementById("translate_container");
    if (temp1)
    {
        temp1.remove();
    }

    document.getElementById("info-contents").style.display = "block";
    observer3.observe(document, {
        childList: true,
        subtree: true
    });
});

var intervalFunction;

var youtubeApp = document.getElementsByTagName("ytd-app");
console.log(youtubeApp[0]);
if (youtubeApp != null && youtubeApp.length > 0 && document.getElementsByTagName("ytd-app")[0].attributes[0].name === "is-watch-page")
{
    intervalFunction = setInterval(function () {
        if (document.body.getElementsByTagName("ytd-watch-flexy").length > 0) {
            clearInterval(intervalFunction);
            observer2.observe(document.body.getElementsByTagName("ytd-watch-flexy")[0], {
                attributeFilter: [ "video-id" ]
            });
        }
    }, 500);
}

const observer = new MutationObserver(function (mutations, me) {
    if (document.getElementsByTagName("ytd-app")[0].attributes[0].name === "is-watch-page")
    {
        intervalFunction = setInterval(function () {
            if (document.body.getElementsByTagName("ytd-watch-flexy").length > 0) {
                clearInterval(intervalFunction);
                observer2.observe(document.body.getElementsByTagName("ytd-watch-flexy")[0], {
                    attributeFilter: [ "video-id" ]
                });
            }
        }, 500);
    }
    else
    {
        observer4.disconnect();
        observer3.disconnect();
        observer2.disconnect();
        idList = [];
        console.log("Youtube homepage");
    }
});

observer.observe(document.getElementsByTagName("ytd-app")[0], {
    attributes: true
});

// ==UserScript==
// @name         YouTube Focus Mode
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Removes distractions from YouTube homepage, and sets theatre mode as default. Turns off comments on videos.
// @author       Aslam
// @match        https://www.youtube.com/*
// @namespace    https://github.com/dev-aslam/youtube-focus-mode
// @homepageURL  https://github.com/dev-aslam/youtube-focus-mode
// @downloadURL  https://raw.githubusercontent.com/dev-aslam/youtube-focus-mode/main/youtube_focus.js
// @updateURL    https://raw.githubusercontent.com/dev-aslam/youtube-focus-mode/main/youtube_focus.js
// @grant        none
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=128&domain=youtube.com
// ==/UserScript==

(function() {
    'use strict';
    const navbar_logo = document.getElementById("logo_icon");
    const navbar_search = document.getElementById("center");
    // Create a new div element
    const container = document.createElement('div');

    function removeVideos() {
        //remove #comments to enable comments
        const videoElements = document.querySelectorAll('ytd-rich-grid-renderer, ytd-rich-item-renderer, #home-page-skeleton, ytd-mini-guide-renderer, tp-yt-app-drawer, yt-icon-button, ytd-reel-shelf-renderer,#related,#info-skeleton,#meta-skeleton,ytd-merch-shelf-renderer,#comments, #panels, #chat-container, #donation-shelf');
        videoElements.forEach(element => {
            element.style.display = "none";
        });
    }

    function enableTheatreMode(){
        let now = new Date();
        let time = now.getTime();
        let expireTime = time + 10000*360000;
        now.setTime(expireTime);
        document.cookie = 'wide = 1;expires='+now.toUTCString()+';path=/';
    }

    //for homepage
    function custom_home() {
        // Selecting logo img for tweaking
        const logo = document.getElementById("logo-icon");
        // selecting search bar
        const search = document.getElementById("center");

        // Tweaking some css for searchbar and logo
        search.style.flex = '0';
        search.style.maxWidth = "650px";
        search.style.width = "100%";
        logo.style.height = '70px';
        logo.style.width = '210px';

        //to fix logo and search not showing when clicking on logo
        const youtube_link = document.querySelector("a.yt-simple-endpoint.style-scope.ytd-topbar-logo-renderer");
        youtube_link.classList.remove("yt-simple-endpoint");
        const youtube_logo = document.getElementById("logo");

        // Apply CSS styles to the container
        container.style.height = 'calc(100vh - 200px)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';

        // Creating container for logo
        const logo_container = document.createElement('div');
        // Apply CSS styles to the logo container
        logo_container.style.paddingLeft = '50px';
        logo_container.style.maxWidth = '560px';
        logo_container.style.width = '100%';

        logo_container.append(youtube_logo);
        container.append(logo_container);
        container.append(search);

        const parent = document.getElementById("primary");
        parent.append(container);
    }

    //for other pages
    function custom_page(){
        const navbar = document.getElementById("end");
        navbar_search.style.flex = '';
        navbar_search.style.maxWidth = '';
        navbar_search.style.width = '';
        navbar.parentNode.insertBefore(navbar_search, document.getElementById("end"));

        const logo_cont = document.getElementById("start");
        const navbar_logo = document.getElementById("logo-icon");
        navbar_logo.style.height = '';
        navbar_logo.style.width = '';
        logo_cont.append(navbar_logo);
    }

    function handlePageChange(){
        if(window.location.pathname === ("/" || "/?app=desktop")){
            setTimeout(custom_home,300);
        }
        else if(window.location.pathname === "/results"){
            setTimeout(custom_page,300);
        }
        else if(window.location.pathname === "/watch"){
            enableTheatreMode();
        }
        else if(window.location.pathname === "/channel"){

        }
        else if(window.location.pathname.slice(0,2) === "/@"){

        }
    }

    function removeContainer(){
        container.remove();
    }

    //to make initial change
    removeVideos();
    handlePageChange();

    // Watch for changes on the page
    const observer = new MutationObserver(()=>{
        removeVideos();
    });
    const observerConfig = { childList: true, subtree: true };
    observer.observe(document.body, observerConfig);

    //listen for url change and triggers on successful url change
    window.navigation.addEventListener('navigatesuccess',(event)=>{
        handlePageChange();
    });

    window.navigation.addEventListener('navigate',(event)=>{
        removeContainer();
    });

})();
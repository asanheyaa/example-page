function jq(myid) {
    return myid.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1");
}

function updateURLParameter(url, param, paramVal) {
    let TheAnchor = null;
    let newAdditionalURL = "";
    let tempArray = url.split("?");
    let baseURL = tempArray[0];
    let additionalURL = tempArray[1];
    let temp = "";

    if (additionalURL) {
        let tmpAnchor = additionalURL.split("#");
        let TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if (TheAnchor) {
            additionalURL = TheParams;
        }

        tempArray = additionalURL.split("&");

        for (let i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }
    else {
        let tmpAnchor = baseURL.split("#");
        let TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];

        if (TheParams) {
            baseURL = TheParams;
        }
    }

    if (TheAnchor) {
        paramVal += "#" + TheAnchor;
    }

    let rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function getUrlParameter(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);

    if (!results) {
        return null;
    }

    if (!results[2]) {
        return '';
    }

    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function initImages() {
    Object.keys(base64_images).forEach(imgClass => {
        // $('.' + jq(imgClass)).attr("src", base64_images[imgClass]);
        $(document.getElementsByClassName(imgClass)).attr("src", base64_images[imgClass]);
    });

    if (!previewOnly) {
        $('.clickable-image').click(function (e) {
            e.preventDefault();

            // The images inside Banner needs no clicks
            if($(this).closest('.table-container').hasClass('table_style_5_container')){
                e.stopPropagation();
                return;
            }

            if ($('#lightbox').length > 0) { // #lightbox exists
                $('#lightbox-content').html($(this)[0].outerHTML);
                $('#lightbox').fadeIn(500);
                $('#lightbox img').click(function (e) {
                    e.stopPropagation();
                });
            }
            else { //#lightbox does not exist - create and insert (runs 1st time only)
                var lightbox = '<div id="lightbox">' + '<p id="close-button">✕</p>' + '<div id="lightbox-content">' + //insert clicked link's href into img src
                    $(this)[0].outerHTML + '</div>' + '</div>';
                $('body').append(lightbox).hide().fadeIn(500);
                $('#lightbox').click(function (e) {
                    $('#lightbox').fadeOut(500);
                });
                $('#lightbox img').click(function (e) {
                    e.stopPropagation();
                });
            }
        });
    }
}

function initTopics(lang) {
    $(".per-language").get().forEach(function (div) {
        $(div).removeClass('ng-show');
    });

    $(".special-table").removeClass('ng-show');
    $("#special_table_" + lang).addClass('ng-show');

    $('#topic-options-' + lang).addClass('ng-show');
    $('#content-' + lang).addClass('ng-show');

    if (!previewOnly) {
        if ((config.default && config.filename && config.filename.trim() !== '') || (!config.default && config.filenames && config.filenames[lang] && config.filenames[lang].trim() !== '')) {
            $('.download-button').addClass('ng-show');
        }
        else {
            $('.download-button').removeClass('ng-show');
        }
    }
}

function initProject() {
    let html = '<ul>';
    let valueLanguage;

    if (languages[0]) {
        valueLanguage = languages[0].locale;
        let urlLocale = getUrlParameter('locale');
        if (urlLocale && urlLocale !== null && urlLocale !== '') {
            valueLanguage = urlLocale.replace(/-/g, '_');
        }
        $('.label-language').text(valueLanguage.substr(0, valueLanguage.indexOf('_')));
        $('#lang-value').attr('value', valueLanguage);
        initTopics(valueLanguage);
        if (!previewOnly) {
            let newURL = updateURLParameter(window.location.href, 'locale', valueLanguage.replace(/_/g, '-'));
            window.history.replaceState('', '', newURL);
        }
    }

    languages.forEach(function (lang) {
        let className = lang.locale === valueLanguage ? 'active' : '';
        html += '<li class="' + className + '" data-ln="' + lang.locale + '">' + lang.language_name + '</li>';
    });
    html += '</ul>';

    // Initialize the base64 images as per defined image classes
    initImages();

    $('.language-dropdown').html(html);
}

var fixmeTop = 100;

function downloadPdf() {
    let lang = $('#lang-value').attr('value');
    let a = document.createElement("a");
    a.target = "_blank";
    if (config.default) {
        a.href = './pdf_download/default/' + config.filename;
        a.setAttribute("download", config.filename);
    } else {
        a.href = './pdf_download/' + lang + '/' + config.filenames[lang];
        a.setAttribute("download", config.filenames[lang]);
    }
    a.click();
}

jQuery(document).ready(function ($) {

    // ========= In mobile when a link with no sub chapters is clicked, the following hides the sidebar.

    $('.sidebar .nav-link.no-sub-chapters').on('click', function() {

        $('.sidebar, .overlay-page').removeClass('active');

    });

    // ========= Fixes the issue where the language dropdown wouldn't hide on second click.

    $('.language-holder').on('click', function() {
        $(this).toggleClass('active');
    });

    // ========= When switching from desktop to mobile/tablet mode, for a second you see the sidebar menu text before it slides out of view. The following fixes that.

    $('.mobile-menu-button').on('click', function() {
        $('.sidebar').addClass('anime');
    });
    $('.sidebar .close-button').on('click', function() {
        setTimeout(function() {
            $('.sidebar').removeClass('anime');
        }, 400);
    });

    // ========= Header mobile

    $(document).mouseup(function (e) {
        const container = $('.language-holder-block');
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.removeClass('active');
        }
    });

    // ========= Lightbox
    $('.image-lightbox').fancybox({
        buttons: ['close'],
        clickContent: false,
    });

    // ============ Sidebar menu
    const overlay = $('.overlay-page');
    const sidebarBlock = $('.sidebar');

    $('.mobile-menu-button').on('click', function () {
        overlay.addClass('active');
        sidebarBlock.addClass('active');
    });
    $('.close-button').on('click', function () {
        overlay.removeClass('active');
        sidebarBlock.removeClass('active');
    });
    $('.overlay-page').on('click', function () {
        overlay.removeClass('active');
        sidebarBlock.removeClass('active');
    });

    $('.navbar .active a').on('click', function () {
        var jump = $(this).attr('href');
        var new_position = $(jump).offset();
        $('html, body').animate({
            scrollTop: new_position.top - 18
        }, 500);

        return false;
    });

    const menuButton = $('.menu-button');
    const navSite = $('.sidebar');
    const toggleNavItem = $('.sidebar a');
    const ancorItem = $('.sidebar .submenu-2 a');

    if (previewOnly) {
        $(".per-language").get().forEach(function (div) {
            $(div).addClass('ng-show');
        });
    }

    // Set html content
    initProject();

    function showActiveChapter_1() {
        // hideAllChapters();
        let lang = $('#lang-value').attr('value');
        let activeChapter_1 = $('#topic-options-' + lang).find(".nav-item.active");
        if (activeChapter_1) {
            let blockId = activeChapter_1.attr('link');
            if (blockId) {
                $('#content-' + lang).find(jq(blockId)).addClass('active');
            }
        }

        // let prevCh = $(activeChapter_1).prev()[0];
        // let nextCh = $(activeChapter_1).next()[0];
        // updatePrevNextBtns(prevCh, nextCh);
    }

    function hideAllChapters() {
        $('.per-chapter').removeClass('active');
    }

    function getBreadcrumbs(topic) {
        let chapterLinks = [];
        let parentTopic = topic.parentElement;
        let total = 1;
        while (parentTopic && parentTopic.tagName === 'LI') {
            let link = $(parentTopic).find('> a');
            chapterLinks.unshift(link);
            parentTopic = parentTopic.parentElement.parentElement.parentElement;
            total++;
        }
        return {
            'chapterLinks': chapterLinks
        };
    }

    var pageSize = 5;
    var currentPageNumber = 1;

    var showPage = function (page) {
        $("#search-results > div").css('display', 'none');
        $("#search-results > div").each(function (n) {
            if (n >= pageSize * (page - 1) && n < pageSize * page) {
                $(this).css('display', 'block');
            }
        });
    };

    function initPagination() {
        let total_res = $("#search-results > div").length;

        if (total_res === 0) {
            $("#search-results").append('<section id="pagin"><span id="no-results-found">Geen overeenkomsten</span></section>');
            return;
        }

        $("#search-results").append('<section id="pagin"></section>');

        showPage(1);

        $("#pagin").pagination({
            items: total_res,
            itemsOnPage: pageSize,
            currentPage: currentPageNumber,
            onPageClick: function (currentPageNumber) {
                showPage(currentPageNumber);
            }
        });
    }

    var targetClicked = true;
    var clickedTarget = '';

    function scrollToBlock(blockId, highlight) {
        let lang = $('#lang-value').attr('value');
        let target = $('#content-' + lang).find(jq(blockId))[0];
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'start'
            });

            if (highlight) {
                if (targetClicked) {
                    $('.ltb-container').removeClass('hightlight');
                }
                targetClicked = false;
                setTimeout(function () {
                    targetClicked = true;
                }, 550);
                clickedTarget = target;
                $(clickedTarget).addClass('hightlight');
            }
        }
    }

    $(window).scroll(function () {
        if (targetClicked) {
            $('.ltb-container').removeClass('hightlight');
        }
    });

    toggleNavItem.on('click', function () {
        const activeItem = $(this).parent();

        let check = activeItem.hasClass('active');

        $("#search-results").removeClass('active');

        let lang = $('#lang-value').attr('value');

        $("#special_table_" + lang).addClass('ng-show');
        $('#content-' + lang).addClass('ng-show');

        if (menuButton.hasClass('active')) {
            menuButton.removeClass('active');
            navSite.removeClass('active');
        }

        if (activeItem.hasClass('active')) {
            activeItem.removeClass('active');
            return;
        }
        else {
            activeItem.parent().find('li').removeClass('active');
            activeItem.addClass('active');
        }

        if (check) {
            return true;
        }
        showActiveChapter_1();
    });

    function initClick(link, chapterLinks) {
        $(link).on('click', function () {
            $("#search-results").removeClass('active');
            let lang = $('#lang-value').attr('value');
            $('#topic-options-' + lang).find(".nav-item.active").removeClass('active');

            $("#special_table_" + lang).addClass('ng-show');
            $('#content-' + lang).addClass('ng-show');
            for (var i = 0; i < chapterLinks.length; i++) {
                let link = chapterLinks[i];
                $(link).click();
            }
            $("#pagination").addClass('active');
        });
    }

    menuButton.on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            navSite.removeClass('active');
        }
        else {
            $(this).addClass('active');
            navSite.addClass('active');
        }

    });

    ancorItem.on('click', function () {
        if (menuButton.hasClass('active')) {
            menuButton.removeClass('active');
            navSite.removeClass('active');
        }

        const blockId = $(this).attr('href');
        if (blockId !== "#") {
            scrollToBlock(blockId, true);
        }
        showActiveChapter_1();
        return false;
    });

    function highlight(keyword) {

        if (keyword === undefined) {
            keyword = $('#searchValue').val();
        }

        keyword = keyword.trim();

        $("#search-results").html('');
        $(".special-table").removeClass('ng-show');
        $(".per-language").removeClass('ng-show');

        $("#search-results").addClass('active');

        // hideAllChapters();
        let lang = $('#lang-value').attr('value');

        $('#topic-options-' + lang).addClass('ng-show');

        let totalRes = $('#topic-options-' + lang).find(".nav-link").get().length;
        let resultCount = 0;
        $('#topic-options-' + lang).find(".nav-link").get().forEach(function (topic) {
            var topicElement = $('#content-' + lang).find(jq($(topic).attr('href'))).closest('.description-block')[0];
            $(topicElement).unmark({
                done: function () {
                    $(topicElement).mark(keyword, {
                        done: function () {
                            $(jq($(topic).attr('href'))).unmark({
                                done: function () {
                                    var searchReg = new RegExp('(<mark)', 'gi');
                                    var count = ($(topicElement).html().match(searchReg) || []).length;
                                    resultCount++;
                                    // New search
                                    if (count > 0) {
                                        let result = document.createElement('div');
                                        let heading = $(topic).clone();
                                        result.append(heading[0]);
                                        let description = $(topicElement).clone();
                                        $(description[0]).css('display', 'block');
                                        $(description).find('> :first-child').remove();
                                        let plainText = document.createElement('div');
                                        $(plainText).addClass('description-block');
                                        $(plainText).html($(description).text());
                                        $(plainText).mark(keyword, {
                                            done: function () {
                                                result.append(plainText);
                                                let response = getBreadcrumbs(topic);
                                                $("#search-results").append($(result));
                                                initClick($(heading), response.chapterLinks);
                                            }
                                        });

                                    }

                                    if (resultCount === totalRes && keyword !== '') {
                                        initPagination();
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });

        if (keyword === '') {
            $("#search-results").removeClass('active');
            // let lang = $('#lang-value').attr('value');
            $("#special_table_" + lang).addClass('ng-show');
            $('#content-' + lang).addClass('ng-show');
            showActiveChapter_1();
        }
    }

    $('#searchForm').on('submit', function (event) {
        event.preventDefault();
        highlight();
    });

    $('.hyperlink').on('click', function () {
        const blockId = $(this).attr('href');
        if (blockId !== "#") {
            // To activate the chapter having hyperlinked item so that user can see that on clicking hyperlink
            let element = $(jq(blockId));
            let chapterId = '#' + $(element).closest('wrap').attr('id');
            let chaptersList = $(".sidebar").find('ul.ng-show');
            let chapter = $(chaptersList).find("li[link='" + chapterId + "']");
            if (!$(chapter).hasClass('active')) {
                // If the hyperlinked item is in different chapter than we are viewinf and is active
                $(chapter).find('> a').click();
            }
            scrollToBlock(blockId);
        }
    });

    // ============ Custom Select
    let timeOut;
    // Open language selection by hovering, if hovering longer than 0.5s
    $('.language-holder').mouseenter(function () {
        clearTimeout(timeOut);
        const languageBlock = $(this);
        if (!languageBlock.hasClass('active')) {
            $(languageBlock).addClass('active');
        }
    }).mouseleave(function () {
        const languageBlock = $(this);
        if (languageBlock.hasClass('active')) {
            timeOut = setTimeout(function () {
                $(languageBlock).removeClass('active');
            }, 200);
        }
    });

    $('.language-dropdown li').on('click', function () {
        $('.language-dropdown li').removeClass('active');
        $(this).addClass('active');
        const valueLanguage = $(this).data('ln');
        $('.label-language').text(valueLanguage.substr(0, valueLanguage.indexOf('_')));
        $('#lang-value').attr('value', valueLanguage);
        let newURL = updateURLParameter(window.location.href, 'locale', valueLanguage.replace(/_/g, '-'));
        window.history.replaceState('', '', newURL);
        $('.language-holder').mouseleave();
        initTopics(valueLanguage);
        highlight('');
    });

    // ==== Hide dropdown of subcategories
    $(document).mouseup(function (e) {
        const container = $(".language-holder");
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.removeClass('active');
        }
    });

    if (!previewOnly) {

        let lang = $('#lang-value').attr('value');
        let firstChapter_1 = $('#topic-options-' + lang).find(".nav-item")[0];
        let chapterId = window.location.hash;
        if (chapterId !== '#') {
            let chaptersList = $(".sidebar").find('ul.ng-show');
            let chapter = $(chaptersList).find("a[href='" + chapterId + "']");
            if (chapter && chapter.length > 0) {
                if($(chapter).closest('li').hasClass('chLevel-2')){ // If sub-chapter then first open its chapter
                    $(chapter).closest('li.chLevel-1').find('> a').click();
                }
                $(chapter).click();
                setTimeout(function(){
                    scrollToBlock(chapterId);
                }, 10);
                return;
            }
        }

        if (firstChapter_1) {
            $(firstChapter_1).find('> a').click();
            let blockId = $(firstChapter_1).attr('link');
            if (blockId) {
                $('#content-' + lang).find(jq(blockId)).addClass('active');
            }
        }
    }

});

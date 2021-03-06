var Spaz;
if (!Spaz) Spaz = {};

/***********
Spaz.UI
***********/
if (!Spaz.UI) Spaz.UI = {};

// the currently selected tab (should be the element)
Spaz.UI.selectedTab = null;

// widgets
Spaz.UI.tabbedPanels = {};
Spaz.UI.entryBox = {};
Spaz.UI.prefsCPG = {};

// holder
Spaz.UI.tooltipHideTimeout = null;
// holder for the timeoutObject
Spaz.UI.tooltipShowTimeout = null;
// holder for the timeoutObject
// kind of a const
Spaz.UI.mainTimelineId = 'timeline-friends';


Spaz.UI.playSound = function(url, callback) {
    if (!Spaz.Prefs.get('sound-enabled')) {
        Spaz.dump('Not playing sound ' + url + '- disabled');
        if (callback) {
            Spaz.dump('calling callback manually');
            callback();
            Spaz.dump('ending callback');
        } else {
            Spaz.dump('no callback, returning');
        }
        return;
    }

    Spaz.dump('Spaz.UI.playSound callback:' + callback);
    Spaz.dump("loading " + url);

    var req = new air.URLRequest(url);
    var s = new air.Sound(req);
    var sc = s.play();

    Spaz.dump("playing " + url);
    if (callback) {
        sc.addEventListener(air.Event.SOUND_COMPLETE, callback);
    }



}


Spaz.UI.onSoundPlaybackComplete = function(event) {
    air.trace("The sound has finished playing.");
}


Spaz.UI.playSoundUpdate = function(callback) {
    Spaz.UI.playSound(Spaz.Prefs.get('sound-update'), callback);
}

Spaz.UI.playSoundStartup = function(callback) {
    Spaz.UI.playSound(Spaz.Prefs.get('sound-startup'), callback);
}

Spaz.UI.playSoundShutdown = function(callback) {
    Spaz.UI.playSound(Spaz.Prefs.get('sound-shutdown'), callback);
}

Spaz.UI.playSoundNew = function(callback) {
    Spaz.UI.playSound(Spaz.Prefs.get('sound-new'), callback);
}

Spaz.UI.playSoundWilhelm = function(callback) {
    Spaz.UI.playSound(Spaz.Prefs.get('sound-wilhelm'), callback);
}



Spaz.UI.doWilhelm = function() {
    Spaz.dump('Applying Flash Filter Dropshadow and Negative');
    window.htmlLoader.filters = window.runtime.Array(
    	new window.runtime.flash.filters.DropShadowFilter(3, 90, 0, .8, 6, 6),
    	new window.runtime.flash.filters.ColorMatrixFilter(([ - 1, 0, 0, 0, 255, 0, -1, 0, 0, 255, 0, 0, -1, 0, 255, 0, 0, 0, 1, 0]))
    );
    $('#wilhelm').center();
    $('#wilhelm').show(300);
	setTimeout(Spaz.UI.endWilhelm, 960); // end with a timeout instead of relying on sound to finish
};

Spaz.UI.endWilhelm = function() {
    Spaz.dump('Applying Flash Filter Dropshadow');
    window.htmlLoader.filters = window.runtime.Array(
    	new window.runtime.flash.filters.DropShadowFilter(3, 90, 0, .8, 6, 6)
    );
    $('#wilhelm').hide();
};



Spaz.UI.statusBar = function(txt) {
    $('#statusbar-text').html(txt);
}

Spaz.UI.resetStatusBar = function() {
    $('#statusbar-text').html('Ready');
    Spaz.UI.hideLoading();
}

Spaz.UI.flashStatusBar = function() {
    for (var i = 0; i < 3; i++) {
        $('#statusbar').fadeOut(400);
        $('#statusbar').fadeIn(400);
    }
}

Spaz.UI.showLoading = function() {
    $('#loading').fadeIn(500);
}

Spaz.UI.hideLoading = function() {
    $('#loading').fadeOut(500);
}





Spaz.UI.showPopup = function(panelid) {
    Spaz.dump('showing ' + panelid + '...');
    $('#' + panelid).css('opacity', 0);
    $('#' + panelid).show();
    $('#' + panelid).fadeTo('fast', 1.0,
    function() {
        Spaz.dump(panelid + ':fadeIn:' + 'faded in!');
        Spaz.dump(panelid + ':display:' + $('#' + panelid).css('display'));
        Spaz.dump(panelid + ':opacity:' + $('#' + panelid).css('opacity'));
    });
    Spaz.UI.centerPopup(panelid);
};
Spaz.UI.hidePopup = function(panelid) {
    Spaz.dump('hiding ' + panelid + '...');
    $('#' + panelid).fadeTo('fast', 0,
    function() {
        Spaz.dump('fadeOut:' + 'faded out!');
        Spaz.dump('fadeOut:' + $('#' + panelid).css('display'));
        Spaz.dump('fadeOut:' + $('#' + panelid).css('opacity'));
        $('#' + panelid).hide();
    });
}


Spaz.UI.showUpdateCheck = function() {
    Spaz.UI.showPopup('updateCheckWindow');
}
Spaz.UI.hideUpdateCheck = function() {
    Spaz.UI.hidePopup('updateCheckWindow');
}


Spaz.UI.showAbout = function() {
    this.instance = window.open('app:/html/about.html', 'aboutWin', 'height=400,width=350,scrollbars=yes');
}
Spaz.UI.showHelp = function() {
    this.instance = window.open('app:/html/help.html', 'helpWin', 'height=400,width=350,scrollbars=yes');
}
Spaz.UI.showShortLink = function() {
    this.instance = window.open('app:/html/shorten-url.html', 'shortenWin', 'height=250,width=300');
}
Spaz.UI.showCSSEdit = function() {
    this.instance = window.open('app:/html/css_edit.html', 'cssEditWin', 'height=350,width=400');
}



Spaz.UI.pageLeft = function(tabEl) {
    Spaz.UI.page(tabEl, -1);
}
Spaz.UI.pageRight = function(tabEl) {
    Spaz.UI.page(tabEl, 1);
}
Spaz.UI.page = function(tabEl, distance) {
    panel = tabEl.id.replace(/tab/, 'panel');
    Spaz.dump('Getting page number using \'#' + panel + ' .timeline-pager-number\'');
    var thispage = parseInt($('#' + panel + ' .timeline-pager-number').text());
    Spaz.dump("Current page:" + thispage);
    Spaz.dump("Paging distance:" + distance);
    var newpage = thispage + distance;
    Spaz.dump("New page:" + newpage);
    if (newpage < 1) {
        return;
    }
    Spaz.Data.loadDataForTab(tabEl, false, newpage);
};
Spaz.UI.setCurrentPage = function(tabEl, newpage) {
    panel = tabEl.id.replace(/tab/, 'panel');
    $('#' + panel + ' .timeline-pager-number').html(newpage);
};
Spaz.UI.showEntryboxTip = function() {
    Spaz.UI.statusBar('Logged in as <span class="statusbar-username">' + Spaz.Prefs.getUser() + '</span>. Type your message and press ENTER to send');
}

Spaz.UI.showLocationOnMap = function(location) {
    if (location.length > 0) {
        var url = 'http://maps.yahoo.com/maps_result.php?q1=' + encodeURIComponent(location);
        Spaz.dump("Loading " + url);
        openInBrowser(url);
    }
};

// Spaz.UI.showPopup = function(contentid) {
//	if (!Spaz.UI.popupPanel) {
//		Spaz.UI.popupPanel = new Spry.Widget.HTMLPanel("mainContent");
//	}
//	Spaz.UI.popupPanel.setContent($('#'+contentid).html());
// }
// Spaz.UI.showWhatsNew = function() {
//	Spaz.UI.popupPanel.loadContent('whatsnew.html');
// }
// taken from ThickBox
// http://jquery.com/demo/thickbox/
Spaz.UI.centerPopup = function(windowid) {
    var jqWin = $('#' + windowid);
    var jqBody = $('#container');

    jqWin.css('margin', 0);

    // WIDTH
    var winWidth = jqWin.outerWidth();
    if (jqBody.width() > winWidth) {
        jqWin.css('left', (jqBody.width() - winWidth) / 2);
    } else {
        // jqWin.width()(jqBody.width() - 20);
        // jqWin.width() = jqWin.width()();
        jqWin.css('left', 0);
    }

    // HEIGHT
    var winHeight = jqWin.outerHeight();
    if (jqBody.height() > winHeight) {
        jqWin.css('top', (jqBody.height() - winHeight) / 2);
    } else {
        // jqWin.width()(jqBody.width() - 20);
        // jqWin.width() = jqWin.width()();
        jqWin.css('top', 0);
    }
    // jqBody.css('border', '1px solid red');
    // jqWin.css('border', '1px solid blue');
    Spaz.dump("windowid:#" + windowid);
    Spaz.dump("jqBody.height():" + jqBody.height());
    Spaz.dump("jqBody.width() :" + jqBody.width());
    Spaz.dump("jqWin.height() :" + winHeight);
    Spaz.dump("jqWin.width()  :" + winWidth);
    Spaz.dump("margin	 :" + jqWin.css('margin'));
    Spaz.dump("top		 :" + jqWin.css('top'));
    Spaz.dump("left		 :" + jqWin.css('left'));

}




Spaz.UI.prepMessage = function() {
    var eb = $('#entrybox');
    eb.val('');
    eb[0].setSelectionRange(0, 0);
};

Spaz.UI.prepRetweet = function(entryid) {
	var timelineid = Spaz.UI.selectedTab.id.replace(/tab-/, 'timeline-');
	// air.trace(timelineid);
	// air.trace('#'+timelineid+'-'+entryid);
	var entry = $('#'+timelineid+'-'+entryid);
	// air.trace(entry.html());
	var text = entry.children('.entry-text').text();
	var screenname = entry.children('.entry-user-screenname').text();
	
	var rtstr = 'RT @' + screenname + ': '+text+'';
	
	if (rtstr.length > 140) {
		rtstr = rtstr.substr(0,139)+'…"';
	}
	
    var eb = $('#entrybox');
	eb.focus();
	eb.val(rtstr);
	eb[0].setSelectionRange(eb.val().length, eb.val().length)
	
};

Spaz.UI.prepDirectMessage = function(username) {
    var eb = $('#entrybox');
    eb.focus();
    if (username) {
        eb.val('d ' + username + ' ...');
        eb[0].setSelectionRange(eb.val().length - 3, eb.val().length)
    } else {
        eb.val('d username');
        eb[0].setSelectionRange(2, eb.val().length)
    }
};

Spaz.UI.prepPhotoPost = function(url) {
    var eb = $('#entrybox');
    eb.focus();
    if (url) {
        eb.val(url + ' desc');
        eb[0].setSelectionRange(eb.val().length - 4, eb.val().length);
        return true;
    } else {
        return false;
    }

}

Spaz.UI.prepReply = function(username) {
    var eb = $('#entrybox');
    eb.focus();

    if (username) {
        var newText = '@' + username + ' ';

        if (eb.val() != '') {
            eb.val(newText + eb.val());
            eb[0].setSelectionRange(eb.val().length, eb.val().length);
        } else {
            eb.val('@' + username + ' ...');
            eb[0].setSelectionRange(eb.val().length - 3, eb.val().length);
        }
    } else {
        var newText = '@';
        if (eb.val() != '') {
            eb.val(newText + ' ' + eb.val());
        } else {
            eb.val('@');
        }
        eb[0].setSelectionRange(newText.length, newText.length);
    }
};

/* sends a twitter status update for the current user */
Spaz.UI.sendUpdate = function() {
    var entrybox = $('#entrybox');
    if (entrybox.val() != '' && entrybox.val() != Spaz.Prefs.get('entryboxhint')) {

        Spaz.dump('length:' + entrybox.val().length)

        Spaz.Data.update(entrybox.val(), Spaz.Prefs.getUser(), Spaz.Prefs.getPass());
        // entrybox.val('');
    }
}


Spaz.UI.decodeSourceLinkEntities = function(str) {
    str = str.replace(/&gt;/gi, '>');
    str = str.replace(/&lt;/gi, '<');
    return str;
}


Spaz.UI.setSelectedTab = function(tab) {
    if (!isNaN(tab)) {
        // if a # is passed in, get the element of the corresponding tab
        Spaz.dump('getting tab element for number ' + tab)
        Spaz.UI.selectedTab = Spaz.UI.tabbedPanels.getTabs()[tab]
    } else {
        Spaz.dump('tab element passed in ' + tab)
        Spaz.UI.selectedTab = tab;
    }

    Spaz.dump('Spaz.UI.selectedTab: ' + Spaz.UI.selectedTab.id);

    Spaz.dump('restarting reload timer');
    Spaz.restartReloadTimer();

    Spaz.Data.loadDataForTab(tab);

}


Spaz.UI.reloadCurrentTab = function(force, reset) {
    Spaz.dump('reloading the current tab');
    Spaz.Data.loadDataForTab(Spaz.UI.selectedTab, force, reset);
}


Spaz.UI.autoReloadCurrentTab = function() {
    Spaz.dump('auto-reloading the current tab');
    Spaz.Data.loadDataForTab(Spaz.UI.selectedTab, true);
}

Spaz.UI.clearCurrentTimeline = function() {
    Spaz.dump('clearing the current timeline');
    var section = Spaz.Section.getSectionFromTab(Spaz.UI.selectedTab)

    // reset the lastcheck b/c some timelines will use "since" parameters
	section.lastcheck = 0;
	Spaz.dump('set lastcheck to 0');
	if (section.lastid) {
		section.lastid = 0;
		Spaz.dump('set lastid to 0');
	}
	if (section.lastid_dm) {
		section.lastid_dm = 0;
		Spaz.dump('set lastid_dm to 0');
	}
	


    if (section.canclear) {
        var timelineid = section.timeline;
        $('#' + timelineid + ' .timeline-entry').remove();
        Spaz.dump('cleared timeline #' + timelineid);
    } else {
        Spaz.dump('timeline not clearable');
    }
}


Spaz.UI.markCurrentTimelineAsRead = function() {
    Spaz.dump('clearing the current timeline');
    var section = Spaz.Section.getSectionFromTab(Spaz.UI.selectedTab)

    var timelineid = section.timeline;
    $('#' + timelineid + " div.timeline-entry").each(function() {
        Spaz.DB.markEntryAsRead(Spaz.UI.getStatusIdFromElement(this));
        Spaz.UI.markEntryAsRead(this);
    });

    $().trigger('UNREAD_COUNT_CHANGED');

};


Spaz.UI.toggleTimelineFilter = function() {
    Spaz.dump('toggling class dm-replies on #' + Spaz.Section.friends.timeline)

    if ($('#' + Spaz.Section.friends.timeline).is('.dm-replies')) {
        $('#' + Spaz.Section.friends.timeline).removeClass('dm-replies');
        Spaz.UI.statusBar('Showing all tweets');
    } else {
        $('#' + Spaz.Section.friends.timeline).addClass('dm-replies');
        Spaz.UI.statusBar('Hiding tweets not directed at you');
    }
};



/*
    Remap this function to the new, more OOP-oriented setup
*/
Spaz.UI.showTooltip = function(el, str, previewurl) {

    var opts = {
        'el': el,
        'str': str,
        'previewurl': previewurl,
    }

    // if (e) { opts['e'] = e }
    if (event) {
        opts.e = event
    }

    var tt = new Spaz_Tooltip(opts);
    tt.show();

};





Spaz.UI.hideTooltips = function() {
    // clear existing timeouts
    var tt = $('#tooltip');

    Spaz.dump('clearing show and hide tooltip timeouts');
    clearTimeout(Spaz_Tooltip_Timeout)
    clearTimeout(Spaz_Tooltip_hideTimeout);
    tt.stop();
    $('#tooltip .preview').hide();
    tt.hide();
}


Spaz.UI.getViewport = function() {
    return {
        x: $('#container').scrollLeft(),
        y: $('#container').scrollTop(),
        cx: $('#container').width(),
        cy: $('#container').height()
    };
}






Spaz.UI.showLinkContextMenu = function(jq, url) {
    var el = jq[0];

    // hide any showing tooltips
    // air.trace('hiding tooltip');
    $('#tooltip').hide();

    // show the link context menu
    // air.trace('opening context menu');
    $('#linkContextMenu').css('left', event.pageX)
    .css('top', event.pageY)
    .unbind()
    .show();


    $('#userContextMenu .menuitem').unbind();

    // air.trace('outerHTML:'+el.outerHTML);
    var urlarray = /http:\/\/([^'"]+)/i.exec(url);
    if (urlarray && urlarray.length > 0) {
        var elurl = urlarray[0];

        // air.trace('url from element:'+elurl);
        $('#linkContextMenu-copyLink').one('click', {
            url: elurl
        },
        function(event) {
            Spaz.Sys.setClipboardText(event.data.url);
            // air.trace('Current Clipboard:'+Spaz.Sys.getClipboardText());
        });
        // air.trace('Set one-time click event on #menu-copyLink');
        $(document).one('click',
        function() {
            $('#linkContextMenu').hide();
        });
        // air.trace('set one-time link context menu close event for click on document');
    } else {
        // air.trace('no http link found');
        }
};



Spaz.UI.showUserContextMenu = function(jq, screen_name) {
    if (!screen_name) {
        return false;
    }

    air.trace(screen_name)

    var el = jq[0];

    Spaz.dump(el);

    // hide any showing tooltips
    // air.trace('hiding tooltip');
    $('#tooltip').hide();

    // show the link context menu
    // air.trace('opening context menu for user '+screen_name);
    $('#userContextMenu').css('left', event.pageX)
    .css('top', event.pageY)
    .show();

    $('#userContextMenu .menuitem').attr('user-screen_name', screen_name);


    // air.trace('Set one-time click event on #userContextMenu');
    $(document).one('click',
    function() {
        $('#userContextMenu').hide();
    });

};





Spaz.UI.addItemToTimeline = function(entry, section, mark_as_read, prepend) {
    // alert('adding:'+entry.id)
    if (entry.error) {
        Spaz.dump('There was an error in the entry:' + entry.error)
    }

    var timelineid = section.timeline;

    // air.trace(JSON.stringify(entry));
    if ($('#' + timelineid + '-' + entry.id).length < 1) {
        entry.isDM = false;
        entry.isSent = false;
		if (!entry.favorited) { // we do this to make a favorited property for DMs
			entry.favorited = false;
		}

        if (entry.sender) {
            entry.user = entry.sender
            entry.isDM = true;
        }

		if (!entry.in_reply_to_screen_name) {
			entry.in_reply_to_screen_name = false;
		}
	

        if (timelineid == 'timeline-user') {
            entry.isSent = true;
        }

        Spaz.dump(entry);

        if (!entry.user.name) {
            entry.user.name = entry.user.screen_name
        }
		
		/*
			Check for reply
		*/
		
		if (entry.in_reply_to_user_id && !entry.in_reply_to_screen_name) {
			var reply_matches = null;
			if (reply_matches = entry.text.match(/^@([a-zA-Z0-9_\-]+)/i)) {
				entry.in_reply_to_screen_name = reply_matches[1];
			}
		}
		
        entry.rowclass = "even";
        entry.timestamp = httpTimeToInt(entry.created_at);
        entry.base_url = Spaz.Prefs.get('twitter-base-url');
        entry.timelineid = timelineid;


        /*
            Clean the entry.text
        */
		// save a raw version
		entry.rawtext = entry.text;

        // fix extra ampersand encoding
        entry.text = entry.text.replace(/&amp;(gt|lt|quot|apos);/gi, '&$1;');

        // fix entity &#123; style extra encoding
        entry.text = entry.text.replace(/&amp;#([\d]{3,4});/gi, '&#$1;');

        // air.trace(this.innerHTML);
        if (Spaz.Prefs.get('usemarkdown')) {
            var md = new Showdown.converter();

            // Markdown conversion with Showdown
            entry.text = md.makeHtml(entry.text);

            // put title attr in converted Markdown link
            entry.text = entry.text.replace(/href="([^"]+)"/gi, 'href="$1" title="Open link in a browser window" class="inline-link"');
        }

        // convert inline links
        /*
            Inline links that start with http://
        */
        var inlineRE = /(?:(\s|^|\.|\:|\())(https?:\/\/)((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+([a-z]{2,6}))((?:\/[\w\.\/\?=%&_\-~@#]*)*)/g;
        entry.text = entry.text.replace(inlineRE, '$1<a href=\"$2$3$6\" title="Open link in a browser window" class="inline-link">$3&raquo;</a>');

        /*
            this is the regex we use to match inline
            lots of uncommon but valid top-level domains aren't used
            because they cause more problems than solved
        */
        var inlineRE = /(?:(\s|^|\:|\())((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+(com|net|org|co\.uk|aero|asia|biz|cat|coop|edu|gov|info|jobs|mil|mobi|museum|name|au|ca|cc|cz|de|eu|fm|fr|gd|hk|ie|it|jp|nl|no|nu|nz|ru|st|tv|uk|us))((?:\/[\w\.\/\?=%&_\-~@#]*)*)/g;
        entry.text = entry.text.replace(inlineRE, '$1<a href=\"http://$2$5\" title="Open link in a browser window" class="inline-link">$2&raquo;</a>');

        // email addresses
        entry.text = entry.text.replace(/(^|\s+)([a-zA-Z0-9_+-]+)@([a-zA-Z0-9\.-]+)/gi, '$1<a href="mailto:$2@$3" class="inline-email" title="Send an email to $2@$3">$2@$3</a>');

        // convert @username reply indicators
        entry.text = entry.text.replace(/(^|\s+)@([a-zA-Z0-9_-]+)/gi, '$1<a href="' + Spaz.Prefs.get('twitter-base-url') + '$2" class="inline-reply" title="View $2\'s profile page" user-screen_name="$2">@$2</a>');

        // convert emoticons
        entry.text = Emoticons.SimpleSmileys.convertEmoticons(entry.text)

		// hashtags
		entry.text = entry.text.replace(/(\s|^|\(|\[)(#([a-z0-9]+))/gi, '$1<a href="javascript:;" title="View search results for $2" class="inline-link hashtag-link">$2</a>');

        var entryHTML = Spaz.Tpl.parse('app:/templates/timeline-entry.tpl', entry);

        // Make the jQuery object and bind events
        var jqentry = $(entryHTML);
        if (mark_as_read) {
            jqentry.addClass('read')
            jqentry.removeClass('new')
        }

        if (entry.isDM) {
            jqentry.addClass('dm');
        }

        // We only do the fetch if the mark_as_read is not specified
        if (typeof mark_as_read == 'undefined')
        {
            // The as read callback
            Spaz.DB.asyncGetAsRead(entry.id,
            function(read)
            {
                if (read)
                {
                    // air.trace("Entry " + entry.id + " is read");
                    jqentry.addClass('read');
                    jqentry.removeClass('new');
                    $().trigger('UNREAD_COUNT_CHANGED');
                }
            });
        }

        if (prepend) {
            $('#' + timelineid).prepend(jqentry);
        } else {
            $('#' + timelineid).append(jqentry);
        }


        return true;

    } else {
        Spaz.dump('skipping ' + entry.id);

        return false;
    }

}




Spaz.UI.selectEntry = function(el) {

    Spaz.dump('unselected tweets');
    $('div.timeline-entry.ui-selected').removeClass('ui-selected');


    Spaz.dump('selecting tweet');
    $(el).addClass('ui-selected').addClass('read').each(function() {
        if (entryId = Spaz.UI.getStatusIdFromElement(this)) {
            air.trace("Want to mark as read " + entryId);
            Spaz.DB.markEntryAsRead(entryId);
        }
    });

	Spaz.dump(el);
    Spaz.dump('selected tweet #' + el.id + ':' + el.tagName + '.' + el.className);

    $().trigger('UNREAD_COUNT_CHANGED');
	
}



Spaz.UI.getStatusIdFromElement = function(el) {
    var entryId = null;
    if (el.id.indexOf("timeline-") == 0)
    {
        var index = el.id.indexOf("-", "timeline-".length);
        if (index >= 0)
        {
            entryId = el.id.substring(index + 1);
        }
    }

    //
    if (entryId == null) {
        air.trace("Cannot obtain entry id for entry with DOM id " + this.id);
        return false
    } else {
        return entryId
    }
};


/*
	this returns the first matching element that contains the given id
*/
Spaz.UI.getElementFromStatusId = function(id) {
	var element = $('.entry-id:contains('+id+')').parent().get()[0];
	if (element) {
		air.trace(element.id);
		return element
	}
	return false;
};



Spaz.UI.markEntryAsRead = function(el) {

    $(el).addClass('read');

    $().trigger('UNREAD_COUNT_CHANGED');

}




Spaz.UI.sortTimeline = function(timelineid, reverse, sort_all) {

    /*
        Check the sorting
    */
    var unsorted = false;

    $('#' + timelineid + ' div.timeline-entry').each(function() {

        // air.trace( $(this).find('div.entry-timestamp').text() +":"+ $(this).next().find('div.entry-timestamp').text() );

        if ( parseInt($(this).find('div.entry-timestamp').text()) < parseInt($(this).next().find('div.entry-timestamp').text()) ) {
            unsorted = true;
            return false;
        }
    });

    if (unsorted) {
        // if (sort_all) {
        time.start('sortTimeline');
        var cells = $('#' + timelineid + ' div.timeline-entry').remove().get();
        // } else {
        // var cells = $('#'+timelineid+' div.timeline-entry.needs-cleanup');
        // }
        // Spaz.dump('cells length:'+cells.length);

        if (reverse) {
            $(cells.sort(Spaz.UI.sortTweetElements)).prependTo('#' + timelineid);
        } else {
            $(cells.sort(Spaz.UI.sortTweetElements)).appendTo('#' + timelineid);
        }
        time.stop('sortTimeline');

        // time.report();
        // Spaz.dump('done sorting');
    }

    // time.start('insertIntoTimeline');
    // if ( parseInt($('#' + timelineid + ' div.timeline-entry:last').find('div.entry-timestamp').text()) >= entry.timestamp) {
    // 	$('#' + timelineid).append(jqentry);
    // } else if( 	$('#' + timelineid + ' div.timeline-entry').length < 1) {
    // 	$('#' + timelineid).prepend(jqentry);
    // 	// $('#' + timelineid)[0].innerHTML = entryHTML + $('#' + timelineid)[0].innerHTML;
    //
    // } else {
    //
    // 	/*
    // 		iterate over the timeline from start and add the item in the right place
    // 	*/
    // 	$('#' + timelineid + ' div.timeline-entry').each(function() {
    // 		if ( parseInt($(this).find('div.entry-timestamp').text()) < entry.timestamp ) {
    // 			$(jqentry).insertBefore(this);
    // 			return false;
    // 		} else if ( $(this).next().length == 0 ) {
    // 			$(jqentry).insertAfter(this);
    // 			return false;
    // 		}
    // 	});
    // }
    // time.stop('insertIntoTimeline');

}



Spaz.UI.sortTweetElements = function(a, b) {
    var inta = parseInt($(a).find('.entry-timestamp').text())
    var intb = parseInt($(b).find('.entry-timestamp').text())
    var diff = inta - intb;
    return diff;
};



Spaz.UI.reverseTimeline = function(timelineid) {
    var cells = $('#' + timelineid + ' .timeline-entry');
    cells.reverse(true).remove().appendTo('#' + timelineid);
}


Spaz.UI.getUnreadCount = function() {
    var timelineid = Spaz.Section.friends.timeline;

    // unread count depends on whether or not we're showing everything, or just replies/dms
    if ($('#' + timelineid).is('.dm-replies')) {
        var selector = '#' + timelineid + ' div.timeline-entry.dm, #' + timelineid + ' div.timeline-entry.reply'
    } else {
        var selector = '#' + timelineid + ' div.timeline-entry'
    }

    return $(selector).not('.read').size();
};


Spaz.UI.getNewEntrySelector = function() {
    var timelineid = Spaz.Section.friends.timeline;

    // we change the selector so that messages not showing do not trigger notifications
    if ($('#' + timelineid).is('.dm-replies')) {
        var selector = '#' + timelineid + ' .new.dm, #' + timelineid + ' .new.reply'
    } else {
        var selector = '#' + timelineid + ' .new'
    }

    return selector;
}

Spaz.UI.getNewEntryCount = function() {
    return $(Spaz.UI.getNewEntrySelector()).length;
}


Spaz.UI.notifyOfNewEntries = function() {

    $().trigger('UNREAD_COUNT_CHANGED');

    Spaz.dump('notifyOfNewEntries');
    if (Spaz.UI.getNewEntryCount() > 0) {

        Spaz.dump('NewEntries found!');


        var newtweets = $(Spaz.UI.getNewEntrySelector()).get().sort(Spaz.UI.sortTweetElements).reverse();



        /*
        get newest of the new
        we use this roundabout way of getting things to avoid a problem where
        you could get text from one tweet and a userimg from another
        */
        var newestHTML = newtweets[0].innerHTML;
        Spaz.dump(newestHTML);
        var jqnewest = $(newestHTML);

        Spaz.dump('Sending notification');
        var resp = "";

        var text;
        var img;
        var screen_name;

        jqnewest.each(function(i) {
            switch ($(this).attr('class')) {
            case 'entry-user-screenname':
                screen_name = $(this).text();
                Spaz.dump(screen_name)
                break;
            case 'entry-text':
                text = $(this).text();
                Spaz.dump('TEXT:' + text);
                break;
            case 'entry-user-img':
                img = $(this).text();
                break;
            }
            // resp += $(this).attr('class')+":"+$(this).text()+"\n";
        })
        // alert(resp);
        // Spaz.dump(screen_name);
        //		Spaz.dump(img);
        //		Spaz.dump(text);
        //
        var new_count = Spaz.UI.getNewEntryCount();
        if (new_count > 1) {
            var msg = screen_name + " (+" + (new_count - 1) + ")";
        } else {
            var msg = screen_name;
        }
        Spaz.UI.notify(text, msg, Spaz.Prefs.get('window-notificationposition'), Spaz.Prefs.get('window-notificationhidedelay'), img);
        Spaz.UI.playSoundNew();
        Spaz.UI.statusBar('Updates found');

    } else {
        Spaz.dump('NewEntries NOT found!');
        Spaz.UI.statusBar('No new messages');
    }

}


Spaz.UI.alert = function(message, title) {
    if (!title) {
        title = "Alert"
    }
    Spaz.UI.notify(message, title, null, 5, 'app:/images/spaz-icon-alpha_48.png');
}


Spaz.UI.notify = function(message, title, where, duration, icon, force) {
    if (Spaz.Prefs.get('window-shownotificationpopups') || force) {
        // Spaz.Notify.add(message, title, where, duration, icon);
        PurrJS.notify(title, message, icon, duration, where)
    } else {
        Spaz.dump('not showing notification popup - window-shownotificationpopups disabled');
    }
}






// cleans up and parses stuff in timeline's tweets
Spaz.UI.cleanupTimeline = function(timelineid, suppressNotify, suppressScroll, skip_sort) {

    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        var numentries = $('#' + timelineid + ' div.timeline-entry').length;
        time.start('sortTimeline');
        if (numentries > 1 && !skip_sort) {
            Spaz.dump('Sorting timeline');
            Spaz.UI.sortTimeline(timelineid, true);
        } else {
            air.trace('not sorting');
        }
        time.stop('sortTimeline');
        return false;
    });


    /*
        remove extra entries
    */
    Spaz.Timers.add(function() {
        time.start('removeExtras');
        var tweets = $('#' + timelineid + ' div.timeline-entry');

        var numEntries = tweets.length
        if (numEntries > Spaz.Prefs.get('timeline-maxentries')) {
            var diff = numEntries - Spaz.Prefs.get('timeline-maxentries');
            Spaz.dump("numEntries is " + numEntries + " > " + Spaz.Prefs.get('timeline-maxentries') + "; removing last " + diff + " entries");
            tweets.slice(diff * -1).remove();
        }
        time.stop('removeExtras');
        return false;
    });


    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        time.start('removeEvenOdd-convertPostTimes');

        $("#" + timelineid + ' .timeline-entry').removeClass('even').removeClass('odd');

        $("#" + timelineid + ' a.status-created-at').each(function(i) {
            $(this).text(get_relative_time($(this).attr('data-created-at')));
        });
        time.stop('removeEvenOdd-convertPostTimes');
        return false;
    });



    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        time.start('applyEvenOdd');
        // apply even class
        $("#" + timelineid + ' .timeline-entry:nth-child(even)').addClass('even');

        // apply odd class
        $("#" + timelineid + ' .timeline-entry:nth-child(odd)').addClass('odd');
        time.stop('applyEvenOdd');
        return false;
    });

    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        time.start('scrollTimeline');
        if (!suppressScroll) {
            if ($("#" + timelineid + ' .timeline-entry:eq(0)').length > 0) {
                // scroll to top
                Spaz.dump('scrolling to .timeline-entry:eq(0) in #' + timelineid);

                if (Spaz.Prefs.get('timeline-scrollonupdate')) {
                    try {
						air.trace('crolliong thee timeline'+timelineid);
                        $('#'+timelineid).parent().scrollTo('.timeline-entry:eq(0)', {
                            speed: 800,
                            easing: 'swing'
                        })
                    } catch(e) {
                        Spaz.dump('Error doing scrollTo first entry - probably switched tabs in the middle of loading. No sweat!');
                    }
                }

            }
        }
        time.stop('scrollTimeline');
        return false;
    });

    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {


        var cleanupTweets = $("div.needs-cleanup", "#" + timelineid);

        time.start('bindOnceFadein');
        cleanupTweets.find('img.user-image').one('load',
        function() {
            // alert('fadingIn');
            $(this).fadeTo('500', '1.0');
        });
        time.stop('bindOnceFadein');

        time.start('highlightReplies');
        // highlight all messages that mention @username
        cleanupTweets.find(".status-text").each(function(i) {
            var re = new RegExp('@' + Spaz.Prefs.getUser(), 'i');
            if (re.test($(this).html())) {
                // Spaz.dump("found reply in "+$(this).text());
                $(this).parents('div.needs-cleanup').addClass('reply');
            }
        })
        time.stop('highlightReplies');


        /* clean up the .status-text */

        // make it here so we don't instantiate on every loopthrough
        var md = new Showdown.converter();

        time.start('cleanupStatusText');
        cleanupTweets.find("div.status-text").each(function(i) {

            // ******************************
            // Support for shortened URL rewriting
            // ******************************
            // We save this as it will be used in the response status callback
            var divElt = this;

            // We save the text as it could change in the loop due to async callbacks
            var txt = divElt.innerHTML;
 
            var domains = ["short.ie", "tinyurl.com", "is.gd", "snipr.com", "snurl.com", "moourl.com", "url.ie", "snipurl.com", "xrl.us", "bit.ly", "ping.fm", "urlzen.com"];
            var stream = new air.URLStream();

            // time.start('lookingForShortDomains');
            for (var i in domains)
            {
                // Get domain
                var domain = domains[i];

                // Iterate over URL pattern
                var urlRE = new RegExp("http:\\/\\/" + domain + "([\\w\\/]*)", "g");
                var matchArray = null;
                while (matchArray = urlRE.exec(txt)) {
                    // air.trace("Getting content of URL " + matchArray[1]);
                    Spaz.dump("Getting content of URL " + matchArray[1]);

                    // Get the URL
                    var url = matchArray[0];

                    // Now we make a request to obtain the response URL
                    stream.addEventListener(air.HTTPStatusEvent.HTTP_RESPONSE_STATUS, onHTTPResponseStatus, false, 0, true);
                    stream.addEventListener(air.IOErrorEvent.IO_ERROR, onIOError);

                    // Perform load
                    stream.load(new air.URLRequest(url));
                    // air.trace("Decoding " + domain + " URL " + url);
                    Spaz.dump("Decoding " + domain + " URL " + url);
                }

            }
            // time.stop('lookingForShortDomains');

            function onHTTPResponseStatus(event) {
                // air.trace('onHTTPResponseStatus');
                if (event.status == 200) {
                    // Here we get the value to rewrite
                    var targetURL = event.responseURL;
                    var slicerRE = /(?:(\s|^|\.|\:|\())(?:http:\/\/)((?:[^\W_]((?:[^\W_]|-){0,61}[^\W_])?\.)+([a-z]{2,6}))((?:\/[\w\.\/\?=%&_-]*)*)/;
                    var targetDomain = targetURL.replace(slicerRE, "$2");
                    Spaz.dump("Got a response status event for url " + url + ": " + targetURL);
                    $(divElt).find("a[href*=" + url + "]").html(targetDomain + "&raquo;").attr("href", targetURL);
                }
                stream.removeEventListener(air.HTTPStatusEvent.HTTP_RESPONSE_STATUS, onHTTPResponseStatus);
                stream.removeEventListener(air.IOErrorEvent.IO_ERROR, onIOError);
            }

            function onIOError(event) {
                // air.trace('onIOError');
                var targetURL = event.responseURL;
                Spaz.dump('Request to ' + event.responseURL + ' returned an IRErrorEvent');
                Spaz.dump(event);
                stream.removeEventListener(air.HTTPStatusEvent.HTTP_RESPONSE_STATUS, onHTTPResponseStatus);
                stream.removeEventListener(air.IOErrorEvent.IO_ERROR, onIOError);
            }

        });

        time.start('removeCleanupClass');
        // remove the needs-cleanup and show
        cleanupTweets.css('display', '').removeClass('needs-cleanup');
        time.stop('removeCleanupClass');

        time.stop('cleanupStatusText');

        // Spaz.Timers.stop();

        return false;
    });

    /*
        Make this non-blocking
    */
    Spaz.Timers.add(function() {
        //Spaz.dump($("#"+timelineid).html());
        time.start('setNotificationTimeout');
        // we delay on notification of new entries because stuff gets
        // really confused and wonky if you fire it off right away
        if (!suppressNotify) {
            Spaz.dump('Set timeout for notifications');
            Spaz.UI.notifyOfNewEntries();
            // remove "new" indicators
            $("#" + Spaz.Section.friends.timeline + ' .new').removeClass('new');
        }
        time.stop('setNotificationTimeout');

        return false;
    });
}




Spaz.UI.showTab = function(index) {
    Spaz.UI.setSelectedTab(Spaz.UI.tabbedPanels.getTabs()[index]);
    Spaz.UI.tabbedPanels.showPanel(index);
}

Spaz.UI.showPrefs = function() {
    Spaz.UI.setSelectedTab(document.getElementById(Spaz.Section.prefs.tab));
    Spaz.UI.tabbedPanels.showPanel(Spaz.Section.prefs.tab);
}

Spaz.UI.openLoginPanel = function() {
    Spaz.UI.prefsCPG.openPanel(0);
};



Spaz.UI.focusHandler = function(event) {
    e = event || window.event;
    el = e.srcElement || e.target;

    Spaz.dump('FOCUS name:' + e.name + ' tagname:' + el.tagName + ' id:' + el.id);
};

Spaz.UI.blurHandler = function(event) {
    e = event || window.event;
    el = e.srcElement || e.target;

    Spaz.dump('BLUR	 name:' + e.name + ' tagname:' + el.tagName + ' id:' + el.id);
};

Spaz.UI.clickHandler = function(event) {
    e = event || window.event;
    el = e.srcElement || e.target;

    Spaz.dump('BLUR	 name:' + e.name + ' tagname:' + el.tagName + ' id:' + el.id);
};



function hash_code(string) {
    h = 0
    for (i = 0; i < string.length; i++) {
        h = string.charCodeAt(i) + ((h << 5) - h);
    }
    return h
}

function hash_color(string) {
    return 'hsl('+hash_code(string)%360+', 70%, 50%)'
}

function colorize_event(e) {
    for (c of e.classList) {
       if (c.startsWith('event-')) {
           e.style['background'] = e.style['border-color'] = hash_color(c)
       }
    }
}

function colorize_events() {
    console.log("colorize")
    ee = document.getElementsByClassName('fc-event')
    for (i in ee) {
        try {
            colorize_event(ee[i])
        } catch (TypeError) {}
    }
}

function getCookie(cname) {
    var name = cname + "="
    var decodedCookie = decodeURIComponent(document.cookie)
    var ca = decodedCookie.split(';')
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

userid = getCookie('userid')
pwd = getCookie('pwd')

$(document).ready(function() {

    $('#calendar').fullCalendar({
      header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
    })

    req = new XMLHttpRequest()
    req.onreadystatechange = function (oEvent) {
    if (req.readyState === 4) {
        if (req.status === 200) {
            $('#calendar').fullCalendar('addEventSource', fc_events(this.response, {}))
            $('#calendar').fullCalendar('addEventSource', expand_recur_events)
//            colorize_events()
         } else if (req.status == 0) {
         } else {
             window.location.href = "/logout"
         }
      }
    };
    req.open("GET", "/schedule.ics")
    req.send()
})

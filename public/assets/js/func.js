    function reload() {
      var iframe = document.querySelector('iframe')
      iframe.contentWindow.location.reload()
    }

    function back() {
      var iframe = document.querySelector('iframe')
      iframe.contentWindow.history.back()
    }

    function forward() {
      var iframe = document.querySelector('iframe')
      iframe.contentWindow.history.forward()
    }
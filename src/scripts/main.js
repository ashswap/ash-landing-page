import "./navbar";
import "./animations";
import "./sliders";
import "./ourway";
import "./feat-sliders";

if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
} else {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
}

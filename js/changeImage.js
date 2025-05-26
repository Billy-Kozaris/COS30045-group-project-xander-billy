function changeImg() {
        let state = document.getElementById('chartImg'); //set the state var to the <img> tag with id chartImg

        if(state.src.includes("img/OverallDesign1.jpg")){ //if state source is specifically that
          state.src = "img/OverallDesign3.jpg" //change img source to new image, as well as changing the imgDesc P
          document.getElementById("imgDesc").innerHTML = "Suspendisse commodo malesuada metus sit amet gravida. Nulla ornare enim eros, ut aliquam nunc dictum eget. Etiam dapibus, dolor at fermentum commodo, turpis erat viverra tortor, eget viverra magna lacus a elit. Phasellus tellus dui, imperdiet quis quam nec, laoreet volutpat tellus. Vestibulum nec consequat ipsum, et condimentum dui. Duis eu arcu dignissim, efficitur sem in, semper leo. Nam et hendrerit risus. Integer neque nunc,";
          return; //return so it doenst do the below IF statement
        }
        if(state.src.includes("img/OverallDesign3.jpg")){ //if state source is specifically that
          state.src = "img/OverallDesign1.jpg" //change it back, imgDesc P as well
          document.getElementById("imgDesc").innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse luctus a enim vitae dapibus. Nulla et lacus mi. Aenean non accumsan ipsum. Integer urna ante, vulputate ut tellus eget, fermentum fermentum dolor. Sed felis diam, scelerisque eget justo quis, aliquam tempor nibh. Sed nisi mauris, dignissim ut lectus ac, elementum viverra erat. Duis varius vehicula dictum. Sed gravida ante ut risus hendrerit rutrum. Aenean consectetur, tellus sed varius sagittis, lorem purus euismod augue, at consectetur orci nulla quis nisi.";
          return;
        }
}
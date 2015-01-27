var config ={
  debug : false
};

var app = {

  init : function(){

    console.log('\'Allo \'Allo!');

    app.render();

    //alert(window.innerHeight);

  },

  render : function(){

    //var template = ich.content(app.renderContent[config.renderId]);
    //$('#wrapper').html(template);

    setTimeout(app.intro,1000);

  },

  intro : function(){

    setTimeout(app.animate,0);

  },

  animate : function(){

      console.log('animate');
  },

  outro : function(){
      //$('#wrapper').transition({ duration:1000,opacity:0, delay:200 });
  }

};

var router = {

    init: function(){

        Path.map('#/home').to(function(){
          app.init();
        });

        Path.root('#/home');
        Path.listen();
    }

};

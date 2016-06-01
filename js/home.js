(function( global, $ ) {
  'use strict';

  var CircleHoverHandler = (function() {

    var dataEvent = 'data-event',
      smallestCircleDiameter = 180,
      additionalCircleDiameter = 30;

    var guyImages = {
      'default' : 'icons/guyred.jpg',
      'red' : 'icons/guyred.jpg',
      'orange' : 'icons/guyorange.jpg',
      'yellow' : 'icons/guyyellow.jpg'
    }

    return {

      initialize : function() {
        this.isReset = true;
        this.events = global.aboutEvents;
        this.circles = [];
        this.initialCircleDiameter = smallestCircleDiameter;
        this.circleDiameter = this.initialCircleDiameter;

        this.wrapper = $( '.diagram' );

        // get all of the circles
        this.hoverCircles = $( '.circles li' );

        // get the wrapper for the diagram
        this.diagram = $( '.event-wrapper' );

        this.eventLineWrapper = $( '.event-line-wrapper' );
        this.eventLine = $( '.event-line' );

        // get the text box for the content
        this.textBoxWrapper = $( '.event-text-wrapper' );
        this.textBox = $( '.event-text' );

        // get the guy image
        this.guyImage = $( '.guy' );
        
        

        this.order = this._getOrderFromDOM( this.hoverCircles );

        // render rings depending on the amount of events that exist
        this._renderEvents( this.diagram, this.events );

        // bind event that changes event-wrapper data-event value on hover
        this.hoverCircles.hover( $.proxy( this._onHoverEvent, this ) );
        
        // Everything below is for manually setting the "born" event as default
                
        // Set defaultKey to "born"
        var defaultKey = 'born';
        
        // Setting defaultColor to the class name 'yellow'
        var defaultColor = 'yellow';
        this.wrapper.attr( 'data-color', defaultColor );
        
        // Set default guy image to guyImage.yellow
        this.guyImage.attr('src', guyImages.yellow );
        
        // Get the default ring based on the defaultKey above and "select" it
        this.ring = $('.ring[data-event="' + defaultKey + '"]');
        this.ring.addClass( 'selected' );
        
        // Use the class '.event-text' and defaultKey to render the text area
        this.text = $('.event-text');
        this._renderTextBox( this.text, this.events[ defaultKey ] );
        this._setTextBoxCentering( this.text, this.textBoxWrapper, this.wrapper );
        
        // Render the line based on the default ring above
        this._renderLine( this.eventLine, this.ring.index(), this.circles.length );
        
        //Set default guy image based on the defaultColor
        this._setGuyImage( this.guyImage, defaultColor );

      },

      reset : function() {
        this.textBox.empty();
        this.eventLine.width(0);
        this.wrapper.attr('data-color', '');
        this.guyImage.attr('src', guyImages.default );
        this._resetRings();
        this.isReset = true;
        return this;
      },

      _renderEvents : function( el, events ) {
        var len = this.order.length;
        $.each( this.order, $.proxy( function( idx, val ) {

          if ( !this.events.hasOwnProperty( val ) ) {
            return;
          }
          var circle = this._createCircle( this.circleDiameter, val );
          this._positionCircle( circle, idx, len );
          this.diagram.append( circle );
          this.circleDiameter += additionalCircleDiameter;

        }, this ));

        // force the entire wrapper to be tall enough to support the content
        this.wrapper.css({
          height: (this.circleDiameter + 30) + 'px'
        })

        // force the outside wrapper to be as wide as the widest circle
        this.diagram.css({
          width: this.circleDiameter + 'px'
        })

        // force the line wrapper to be the correct max-width
        var centerOffset = ( this.circleDiameter / 2 );
        this.eventLineWrapper.css({
          width: centerOffset + 'px',
          left: centerOffset + 'px',
          top: centerOffset + 'px'
        })

        // set the guy to be in the correct location
        this.guyImage.css({
          top: centerOffset - ( this.guyImage.height() / 2 ) + 'px',
          left: centerOffset - ( this.guyImage.width() / 2 ) + 'px'
        });
      },

      _getOrderFromDOM : function( circles ) {
        var order = [];
        circles.each( function() {
          order.push( $( this ).attr( dataEvent ) );
        });
        return order;
      },

      _createCircle : function( diameter, key ) {
        var circle = $('<div class="ring" ' + dataEvent + '="' + key + '""></div>');
        circle.css({
          width : diameter + 'px',
          height : diameter + 'px'
        });
        this.circles.push( circle );

        return circle;
      },

      _positionCircle : function( circle, idx, totalCircles ) {
        var offset = ( ( totalCircles - idx ) * additionalCircleDiameter ) / 2;
        circle.css({
          top: offset + 'px',
          left: offset + 'px'
        });
        return circle;
      },

      _onHoverEvent : function( e ) {

        this._resetRings();

        // get data to update the UI
        var hoverEl = $( e.target ),
          key = hoverEl.attr( 'data-event' ),
          color = hoverEl[ 0 ].className; // TODO: hack, but w/e

        // get the ring and text box
        var ring = $( '.ring[' + dataEvent + '="' + key  + '"]'),
          textBox = this.textBox;

        // set the color
        this.wrapper.attr( 'data-color', color );

        // set make a ring selected
        ring.addClass( 'selected' );

        // render the text box
        this._renderTextBox( textBox, this.events[ key ] );

        // vertical center align the textbox. FF didn't like the CSS solution :(
        this._setTextBoxCentering( textBox, this.textBoxWrapper, this.wrapper );

        // render the line
        this._renderLine( this.eventLine, ring.index(), this.circles.length );

        // change the guy image
        this._setGuyImage( this.guyImage, color );
        this.isReset = false;
      },

      _resetRings : function() {
        $.each( this.circles, function( circle ) {
          $( this ).removeClass('selected');
        });
      },

      _renderTextBox : function( textBox, data ) {
        var html = '<h2 class="year">' + data.year +'</h2>' +
              '<p class="description klinic">' + data.description + '</p>';

        textBox.html( html );
      },

      _renderLine : function( line, idx, totalCircles ) {
        // get the width and offset left of the line
        var width = ( ( ( totalCircles - idx ) * additionalCircleDiameter ) / 2 );

        line.css({
          width : width + 'px'
        })
      },

      _setTextBoxCentering : function( textBox, textBoxWrapper, diagramWrapper ) {
        var textBoxHeight = textBox.height(),
          wrapperHeight = diagramWrapper.height();

        var offsetTop = ( wrapperHeight - textBoxHeight ) / 2;

        textBoxWrapper.css({
          'margin-top' : offsetTop + 'px'
        });
      },

      _setGuyImage : function( img, color ) {
        if ( color in guyImages ) {
          img.attr( 'src', guyImages[ color ] );
        }
      }

    }

  })();

  // implementation
  ($( function() {
    CircleHoverHandler.initialize();
    // make it so the CircleHoverHandler resets when you go
    // below 'Work Examples'
    var workExamplesTop = $('#work-experiences').offset().top;
    $( window ).scroll( function() {
      if ( !CircleHoverHandler.isReset && $( window ).scrollTop() >= workExamplesTop ) {
        CircleHoverHandler.reset();
      }
    });
  }));

})( window, jQuery );
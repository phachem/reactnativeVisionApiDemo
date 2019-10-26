import * as React from "react";
import { StyleSheet, View, ScrollView, Dimensions, Image } from "react-native";

const DEVICE_WIDTH = Dimensions.get("window").width;



class ImageCarousel extends React.Component {

  scrollRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0
    };
    this.scrollRef = React.createRef();
  }

  componentDidMount = () => {
    setInterval(() => {
      this.setState(
        prev => ({
          selectedIndex:
            prev.selectedIndex === this.props.images.length - 1
              ? 0
              : prev.selectedIndex + 1
        }),
        () => {
          this.scrollRef.current.scrollTo({
            animated: true,
            x: DEVICE_WIDTH * this.state.selectedIndex,
            y: 0
          });
        }
      );
    }, 3000);
  };


  render() {
    const { images } = this.props;
    return (
      <View style={{ height: "80%", width: "100%", top: -20 }}>
        <ScrollView
          horizontal
          pagingEnabled
          ref={this.scrollRef}
        >
          {images.map(image => (
            <Image
              style={styles.backgroundImage}
              source={image} 
              key={image}
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: "100%",
    width: Dimensions.get("window").width,
    resizeMode: 'contain'
  }
});

export { ImageCarousel };
export function getFieldImage(imageKey?: string) {
  switch (imageKey) {
    case "nablus":
      return require("../assets/images/Nablus-Stadium.png");
    case "balata":
      return require("../assets/images/Balata-Camp Football.png");
    case "beitWazan":
      return require("../assets/images/Beit Wazan.png");
    case "salahiyya":
      return require("../assets/images/Al-Salahiyya-School.png");
    case "askar":
      return require("../assets/images/Askar Football.png");
    case "surra":
      return require("../assets/images/Surra Football.png");
    case "balataBalad":
      return require("../assets/images/Balata Al-Balad.png");
    case "najah":
    case "volleyball":
    case "tennis":
    case "handball":
      return require("../assets/images/An-Najah University.png");
    default:
      return require("../assets/images/Nablus-Stadium.png");
  }
}

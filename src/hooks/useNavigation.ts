// Simplified useNavigation hook for TDD testing
interface NavigationObject {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
}

export const useNavigation = (): NavigationObject => {
  return {
    navigate: () => {},
    goBack: () => {},
  };
};
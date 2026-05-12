import React from "react";
import SportChip from "../components/home/sportChip";

describe("SportChip", () => {
  it("creates a component with the provided label", () => {
    const element = <SportChip label="Football" active={true} onPress={() => {}} />;

    expect(element.type).toBe(SportChip);
    expect(element.props.label).toBe("Football");
    expect(element.props.active).toBe(true);
  });
});

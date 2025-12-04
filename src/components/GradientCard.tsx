import { LinearGradient } from 'expo-linear-gradient';
import { ViewProps } from 'react-native';

interface GradientCardProps extends ViewProps {
    colors?: [string, string, ...string[]];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
}

export const GradientCard = ({
    children,
    colors = ['#7F3DFF', '#E024EE'],
    style,
    start = { x: 0, y: 0 },
    end = { x: 1, y: 1 },
    ...props
}: GradientCardProps) => {
    return (
        <LinearGradient
            colors={colors}
            start={start}
            end={end}
            style={[{ borderRadius: 24, padding: 20 }, style]}
            {...props}
        >
            {children}
        </LinearGradient>
    );
};

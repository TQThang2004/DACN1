import { StyleSheet } from "react-native";
import { appColor } from "../contants/appColor";

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        backgroundColor: 'white',
    },

    button: {
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: appColor.blue200,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 40,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#f7f7f5',
        marginBottom: 12,
        width: "100%",
    },

    input: {
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'white',
        minHeight: 52,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: '#f7f7f5',
        marginBottom: 10,
        paddingHorizontal: 18,
        width: "100%",
    },
});
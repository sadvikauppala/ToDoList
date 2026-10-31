package com.mrjaffesclass.apcs.todolist;

import com.mrjaffesclass.apcs.messenger.Messenger;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.Date;
import javax.imageio.ImageIO;
import javax.swing.*;

public class ScreenshotRenderer {
    public static void main(String[] args) throws Exception {
        // Set Look and Feel
        try {
            for (UIManager.LookAndFeelInfo info : UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (Exception ignored) {}

        Messenger messenger = new Messenger();
        AppModel model = new AppModel(messenger);
        model.init();

        // Add sample data with dates
        model.putItem(new ToDoItem(-1, "Complete CI/CD GitHub Actions Pipeline", true, new Date()));
        model.putItem(new ToDoItem(-1, "Test SwingX JXDatePicker functionality", false, new Date(System.currentTimeMillis() + 86400000L)));
        model.putItem(new ToDoItem(-1, "Verify automated JUnit 4 test cases", true, new Date(System.currentTimeMillis() - 86400000L)));
        model.putItem(new ToDoItem(-1, "Publish GitHub Release v1.0.3 package", true, new Date()));
        model.putItem(new ToDoItem(-1, "Deploy API Javadoc to GitHub Pages", false, new Date(System.currentTimeMillis() + 172800000L)));

        // Create MainView
        MainView mainView = new MainView(messenger);
        mainView.init();
        messenger.notify("ready", null, true);
        mainView.addNotify();
        mainView.setSize(780, 500);
        mainView.validate();

        // Render MainView Content to BufferedImage
        Container content1 = mainView.getContentPane();
        content1.setSize(780, 500);
        content1.doLayout();
        content1.validate();

        BufferedImage mainImg = new BufferedImage(780, 500, BufferedImage.TYPE_INT_RGB);
        Graphics2D g1 = mainImg.createGraphics();
        g1.setColor(Color.WHITE);
        g1.fillRect(0, 0, 780, 500);
        content1.printAll(g1);
        g1.dispose();

        File mainOut = new File("C:/Users/uppal/.gemini/antigravity-ide/brain/045d6123-aa86-46ea-9048-3e3e6174b004/todolist_main_view.png");
        ImageIO.write(mainImg, "png", mainOut);
        System.out.println("MainView screenshot rendered to: " + mainOut.getAbsolutePath());

        // Create EditView
        ToDoItem sampleItem = new ToDoItem(1, "Test SwingX JXDatePicker functionality", false, new Date());
        EditView editView = new EditView(mainView, sampleItem, messenger);
        editView.addNotify();
        editView.setSize(520, 360);
        editView.validate();

        Container content2 = editView.getContentPane();
        content2.setSize(520, 360);
        content2.doLayout();
        content2.validate();

        BufferedImage editImg = new BufferedImage(520, 360, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2 = editImg.createGraphics();
        g2.setColor(Color.WHITE);
        g2.fillRect(0, 0, 520, 360);
        content2.printAll(g2);
        g2.dispose();

        File editOut = new File("C:/Users/uppal/.gemini/antigravity-ide/brain/045d6123-aa86-46ea-9048-3e3e6174b004/todolist_edit_view.png");
        ImageIO.write(editImg, "png", editOut);
        System.out.println("EditView screenshot rendered to: " + editOut.getAbsolutePath());

        // Create AboutView
        AboutView aboutView = new AboutView(mainView, true);
        aboutView.addNotify();
        aboutView.setSize(420, 300);
        aboutView.validate();

        Container content3 = aboutView.getContentPane();
        content3.setSize(420, 300);
        content3.doLayout();
        content3.validate();

        BufferedImage aboutImg = new BufferedImage(420, 300, BufferedImage.TYPE_INT_RGB);
        Graphics2D g3 = aboutImg.createGraphics();
        g3.setColor(Color.WHITE);
        g3.fillRect(0, 0, 420, 300);
        content3.printAll(g3);
        g3.dispose();

        File aboutOut = new File("C:/Users/uppal/.gemini/antigravity-ide/brain/045d6123-aa86-46ea-9048-3e3e6174b004/todolist_about_view.png");
        ImageIO.write(aboutImg, "png", aboutOut);
        System.out.println("AboutView screenshot rendered to: " + aboutOut.getAbsolutePath());

        System.exit(0);
    }
}

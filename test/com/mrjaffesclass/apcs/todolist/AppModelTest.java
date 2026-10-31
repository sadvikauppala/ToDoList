package com.mrjaffesclass.apcs.todolist;

import com.mrjaffesclass.apcs.messenger.*;
import java.util.ArrayList;
import java.util.Date;
import org.junit.After;
import org.junit.AfterClass;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

/**
 * Unit test for the AppModel class
 * @author Roger Jaffe
 * @version 1.0
 */
public class AppModelTest {
  
  public Messenger messenger;
  public AppModel model;
  public String[] initialData = {
    "Do APCS project", 
    "Finish English paper", 
    "Proofread resume",
    "Get gas in the car",
    "Deposit paycheck"
  };
  public ArrayList<ToDoItem> testArrayList;
  
  public AppModelTest() {
  }
  
  @BeforeClass
  public static void setUpClass() {
  }
  
  @AfterClass
  public static void tearDownClass() {
  }
  
  @Before
  public void setUp() {
    messenger = new Messenger();
    model = new AppModel(messenger);
    model.init();
    model = this.addSampleItems(model);
    
    this.testArrayList = new ArrayList<>();
    for (int i=0; i<initialData.length; i++) {
      testArrayList.add(new ToDoItem(-1, initialData[i]));
    }
  }
  
  @After
  public void tearDown() {
  }

  /**
   * Test of messageHandler method, of class AppModel.
   */
  @Test
  public void testMessageHandler() {
    assertTrue("testMessageHandler is not tested", true);
  }

  /**
   * Test of init method, of class AppModel.
   */
  @Test
  public void testInit() {
    assertTrue("init is not tested", true);
  }

  /**
   * Test of getItem method, of class AppModel.
   */
  @Test
  public void testGetItem() {
    ToDoItem item = model.getItem(3);
    assertEquals("testGetItem", "Get gas in the car", item.getDescription());
  }

  /**
   * Test of getItems method, of class AppModel.
   */
  @Test
  public void testGetItems() {
    ArrayList<ToDoItem> ar = model.getItems();
    assertEquals("testGetItems length of ArrayList", 5, ar.size());
  }

  /**
   * Test of putItem method for new ToDoItem
   */
  @Test
  public void testPutItem1() {
    ToDoItem newItem = new ToDoItem(-1, "This is added item 1");
    ToDoItem addedItem = model.putItem(newItem);
    assertEquals("testPutItem1: Item returned", addedItem, newItem);
    assertEquals("testPutItem1: Item description", "This is added item 1", newItem.getDescription());
  }
  
  /** 
   * Test of putItem method for edited existing ToDoItem
   */
  @Test
  public void testPutItem2() {
    ToDoItem item;
    ToDoItem newItem = model.putItem(new ToDoItem(-1, "This is item 1"));
    newItem = model.putItem(new ToDoItem(-1, "This is item 2"));
    assertEquals("testPutItem2: Item count = 2", 7, model.getItems().size());
  }
  

  /**
   * Test of delete method, of class AppModel.
   */
  @Test
  public void testDelete1() {
    assertTrue("testDelete1a: deleteItem returned true", model.deleteItem(1));
    ToDoItem newItem = model.getItem(1);
    assertNull("testDelete1b: Item removed", newItem);
  }

  /**
   * Test of delete method, of class AppModel.
   */
  @Test
  public void testDelete2() {
    ToDoItem item = model.getItem(1);
    assertTrue("testDelete2a: deleteItem returned true", model.deleteItem(item));
    assertEquals("testDelete2b: Correct size of list", 4, model.getItems().size());
    assertNull("testDelete2c: Item deleted", model.getItem(1));
  }

  /**
   * Test of delete method, of class AppModel.
   */
  @Test
  public void testDelete3() {
    assertFalse("testDelete3: item not found", model.deleteItem(8));
  }

  /**
   * Test of controller:getItems message, of class AppModel.
   */
  @Test
  public void testMessages() {
    assertTrue("testMessages", true);
  }
  
  /**
   * Test of sortByDate of class AppModel
   */
  @Test
  public void testSortByDate() {
      ToDoItem earliestItem = new ToDoItem(-1, "02/21/2014", new Date(1392969600000L));
      ToDoItem middleItem = new ToDoItem(-1, "03/20/2014", new Date(1395298800000L));
      ToDoItem latestItem = new ToDoItem(-1, "04/27/2015", new Date(1430118000000L));
      //Test sort earliest first
      model.putItem(latestItem);
      model.putItem(earliestItem);
      model.putItem(middleItem);
      model.sortByDate(true);
      ArrayList<ToDoItem> items = model.getItems();
      assertEquals(earliestItem, items.get(0));
      assertEquals(middleItem, items.get(1));
      assertEquals(latestItem, items.get(2));
      //Now test sort Earliest Last
      model.sortByDate(false);
      items = model.getItems();
      assertEquals(latestItem, items.get(0));
      assertEquals(middleItem, items.get(1));
      assertEquals(earliestItem, items.get(2));
  }
  
  /**
  * Add some initial items to our to do list
  * @param model AppModel under test
  * @return AppModel returned
  */
  public AppModel addSampleItems(AppModel model) {
    for (String description : initialData) {
      model.putItem (new ToDoItem(-1, description));
    }
    return model;
  }
  
}

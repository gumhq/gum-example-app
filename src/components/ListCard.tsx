import styles from '@/styles/Home.module.css';

const ListCard = ({ title, list, renderItem }: any) => (
  <div className={styles.listContainer}>
    <h2 className={styles.title}>{title}</h2>
    {list.map((item: any, index: any) => renderItem(item, index))}
  </div>
);

export default ListCard;
